#!/bin/bash
# Скрипт запуска туннеля для отладки
set -euo pipefail

TUNNEL_NAME=${1:-my-tunnel}
CONFIG_PATH=${2:-/etc/cloudflared/config.yml}

if [ ! -f "$CONFIG_PATH" ]; then
  echo "Config not found: $CONFIG_PATH"
  exit 1
fi

echo "Запускаю tunnel: $TUNNEL_NAME"
cloudflared tunnel --config "$CONFIG_PATH" run "$TUNNEL_NAME"
