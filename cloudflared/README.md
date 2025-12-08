# Cloudflare Tunnel (cloudflared) — инструкция

Этот каталог содержит шаблоны конфигурации и инструкции для настройки постоянного HTTPS-туннеля через Cloudflare Tunnel (cloudflared).

Кратко — что требуется:

1. Аккаунт в Cloudflare и добавленный домен (зона) для вашего сайта.
2. Установленный `cloudflared` на постоянном хосте (VPS, сервер, домашний компьютер с постоянным доступом).
3. Создать tunnel в Cloudflare и скачать файл учётных данных (credentials JSON).
4. Скопировать credentials на хост и положить в `/etc/cloudflared/<TUNNEL-ID>.json`.
5. Настроить `cloudflared/config.yml` (см. шаблон в этом репозитории) и systemd unit.
6. Запустить и включить сервис.

Шаги подробнее:

- Создать туннель локально (на вашей машине) и получить файл учётных данных:

```bash
# установить cloudflared локально, затем
cloudflared tunnel login  # откроет браузер для авторизации
cloudflared tunnel create my-tunnel
# после создания появится файл credentials (обычно ~/.cloudflared/<TUNNEL-ID>.json)
```

- Зарегистрировать DNS-запись для хоста, например `site.example.com`:

```bash
cloudflared tunnel route dns <TUNNEL-ID> site.example.com
```

- Скопировать JSON credentials на сервер в `/etc/cloudflared/<TUNNEL-ID>.json` и создать `/etc/cloudflared/config.yml` по шаблону.

- Пример systemd unit (можно использовать `cloudflared.service`):

```ini
[Unit]
Description=cloudflared Tunnel
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/cloudflared tunnel --config /etc/cloudflared/config.yml run <TUNNEL-NAME>
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

- После этого:

```bash
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared
```

Развёртывание через GitHub Actions

В репозитории есть шаблон workflow, который копирует credentials и конфиг на сервер и перезапускает сервис. Для работы workflow нужны секреты в настройках репозитория:

- `SSH_HOST` — адрес сервера
- `SSH_PORT` — порт SSH (обычно 22)
- `SSH_USER` — пользователь для SSH
- `SSH_KEY` — приватный SSH-ключ (PEM) для доступа
- `CF_TUNNEL_JSON` — содержимое credentials JSON, закодированное в Base64

Workflow расшифрует `CF_TUNNEL_JSON` на runner и переправит файл на сервер, затем выполнит перезапуск сервиса.

Безопасность: никогда не добавляйте credentials JSON в публичный репозиторий. Используйте GitHub Secrets или SCP/SSH для передачи на ваш сервер.
