# Выкладка сайта в Selectel S3 (бакет smallteatrik, Москва / ru-7).
# Нужен rclone с настроенным remote "selectel" — настройка: rclone config create selectel s3 provider=Other endpoint=s3.ru-7.storage.selcloud.ru region=ru-7 access_key_id=... secret_access_key=...
# Запуск:  .\deploy.ps1           — выложить
#          .\deploy.ps1 -DryRun   — показать, что изменится, ничего не трогая

param([switch]$DryRun)

$rcloneArgs = @(
  'sync', $PSScriptRoot, 'selectel:smallteatrik',
  '--exclude', '.git/**',
  '--exclude', '.claude/**',
  '--exclude', '_legacy/**',
  '--exclude', 'concepts/**',
  '--exclude', 'README.md',
  '--exclude', '.gitignore',
  '--exclude', 'deploy.ps1',
  '--checksum',
  '--s3-no-check-bucket',
  '--progress'
)
if ($DryRun) { $rcloneArgs += '--dry-run' }

rclone @rcloneArgs
if ($LASTEXITCODE -eq 0 -and -not $DryRun) {
  Write-Host "`nГотово: https://f8c489ad-4046-45ed-b0e2-4b874ef1ae1a.selstorage.ru"
}
