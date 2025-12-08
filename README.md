# lastosich.github.io

Простой стартовый шаблон сайта для публикации на GitHub Pages.

Как использовать локально:

1. Откройте терминал в корне репозитория.
2. Запустите простой статический сервер (например, Python):

```bash
python3 -m http.server 8000
```

3. Перейдите в браузере на `http://localhost:8000`.

Дальше:
- Редактируйте `index.html` и `css/style.css`.
- Закоммитьте и запушьте изменения в ветку `main` — GitHub Pages автоматически опубликует сайт.

Если хотите, могу выполнить коммит и пуш за вас или настроить Jekyll/Hugo.

## Cloudflare Tunnel — постоянная HTTPS ссылка (инструкция)

Если нужно постоянное HTTPS-доступное подключение к локальному хосту — рекомендую использовать Cloudflare Tunnel (`cloudflared`). Я добавил шаблоны конфигурации и скрипты в каталог `cloudflared/` и workflow для деплоя на удалённый сервер.

Короткая последовательность действий:

1. Зарегистрируйте домен в Cloudflare и добавьте зону.
2. На локальной машине или сервере выполните:

```bash
# Установите cloudflared (или используйте скрипт ./scripts/install-cloudflared.sh)
# Создайте туннель и получите credentials JSON:
cloudflared tunnel login
cloudflared tunnel create my-tunnel
cloudflared tunnel route dns <TUNNEL-UUID> site.your-domain.com
```

3. Скопируйте файл credentials (JSON) и `cloudflared/config.yml` на ваш постоянный сервер в `/etc/cloudflared/`.
4. Создайте systemd unit и включите сервис, либо используйте `scripts/run-tunnel.sh` для отладки.
5. В Cloudflare DNS появится запись и через пару минут сайт будет доступен по HTTPS.

Автоматизация через GitHub Actions:
- В `.github/workflows/deploy-cloudflared.yml` есть шаблон workflow, который берет секрет `CF_TUNNEL_JSON` (Base64) и SSH-ключ для копирования credentials и конфига на ваш сервер, после чего перезапускает `cloudflared`.

Секреты, которые нужно добавить в `Settings → Secrets`:
- `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_KEY` — для доступа к серверу
- `CF_TUNNEL_JSON` — содержимое credentials JSON, закодированное в Base64

Безопасность: не добавляйте credentials в публичный репозиторий. Файлы учётных данных игнорируются через `.gitignore`.

Подробнее в `cloudflared/README.md`.
