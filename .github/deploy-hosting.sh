#!/usr/bin/env bash
# Собирает сайт в _deploy/ с .htaccess для Apache и заливает на хостинг. Без --upload только собирает.
# Переменные для заливки: HOSTING_PROTOCOL (sftp|ftp), HOSTING_HOST, HOSTING_USER, HOSTING_PASSWORD, HOSTING_DIR.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=_deploy
rm -rf "$OUT"
mkdir -p "$OUT"

# На сайт едет только то, что он отдаёт: исходники макетов, черновики и служебное остаются в репозитории.
git ls-files -z \
  | grep -zvE '^(\.github/|\.claude/|_legacy/|concepts/|\.gitignore$|README\.md$|deploy\.ps1$)' \
  | xargs -0 cp --parents -t "$OUT"

# Адреса без .html (/afisha вместо /afisha.html) держит Apache — на хранилище такого не было.
cat > "$OUT/.htaccess" <<'HTACCESS'
Options -Indexes -MultiViews
DirectoryIndex index.html
AddType font/woff2 .woff2

RewriteEngine On

# Проверка Let's Encrypt должна дойти до хостинга, иначе сертификат не выпустится.
RewriteRule ^\.well-known/acme-challenge/ - [L]

# Главный адрес — без www.
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]

# Адрес с .html — на чистый вариант.
# THE_REQUEST хранит исходный запрос, поэтому внутренняя подмена ниже сюда не возвращается.
RewriteCond %{THE_REQUEST} \s/+(.*/)?index\.html[?\s]
RewriteRule ^ /%1 [R=301,L]
RewriteCond %{THE_REQUEST} \s/+([^?\s]+)\.html[?\s]
RewriteRule ^ /%1 [R=301,L]

# /afisha -> afisha.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+?)/?$ $1.html [L]

# html, css, js и json браузер всегда сверяет с сервером, остальное держит сутки.
<IfModule mod_headers.c>
  <FilesMatch "\.(html|css|js|json)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  <FilesMatch "\.(woff2|png|jpe?g|webp|svg|ico|mp4)$">
    Header set Cache-Control "public, max-age=86400"
  </FilesMatch>
</IfModule>
HTACCESS

echo "built: $(find "$OUT" -type f | wc -l) files, $(du -sh "$OUT" | cut -f1)"
[[ "${1:-}" == "--upload" ]] || exit 0

if [[ -z "${HOSTING_HOST:-}" ]]; then
  echo "::error::HOSTING_HOST не задан — заливать некуда"
  exit 1
fi
fail() { echo "::error::$*"; exit 1; }
[[ -n "${HOSTING_USER:-}" ]] || fail "переменная HOSTING_USER пуста"
[[ -n "${HOSTING_PASSWORD:-}" ]] || fail "секрет HOSTING_PASSWORD пуст или не виден"
[[ -n "${HOSTING_DIR:-}" ]] || fail "переменная HOSTING_DIR пуста"
echo "target=${HOSTING_PROTOCOL}://${HOSTING_HOST}/${HOSTING_DIR}"

# .well-known и cgi-bin создаёт сам хостинг: --delete не должен их трогать.
LFTP_PASSWORD="$HOSTING_PASSWORD" lftp --env-password -u "$HOSTING_USER" "${HOSTING_PROTOCOL}://${HOSTING_HOST}" -e "
  set cmd:fail-exit yes
  set net:max-retries 3
  set net:timeout 20
  set sftp:auto-confirm yes
  set ftp:ssl-allow yes
  mirror --reverse --delete --verbose --parallel=4 \
    --exclude-glob .well-known/ --exclude-glob cgi-bin/ \
    $OUT/ $HOSTING_DIR/
  quit
" || fail "заливка на ${HOSTING_HOST} не удалась, подробности в логе шага"
