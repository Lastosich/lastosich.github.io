#!/bin/bash
# Скрипт установки cloudflared на Debian/Ubuntu
set -euo pipefail

if command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared уже установлен"
  exit 0
fi

echo "Устанавливаю cloudflared..."

# Обновляем и устанавливаем curl
apt-get update
apt-get install -y curl gnupg

# Добавляем репозиторий Cloudflare
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-archive-keyring.gpg
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-archive-keyring.gpg] https://pkg.cloudflare.com/ $(lsb_release -cs) main' | sudo tee /etc/apt/sources.list.d/cloudflare.list

apt-get update
apt-get install -y cloudflared

echo "Установка завершена."


echo "Пример: systemd unit можно создать как /etc/systemd/system/cloudflared.service"
