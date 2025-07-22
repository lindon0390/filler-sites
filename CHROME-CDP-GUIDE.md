# 🔌 Гид по подключению к Chrome через CDP

## Быстрый старт

### 1. Проверить статус Chrome
```bash
npm run chrome:status
```

### 2. Запустить Chrome с отладочным портом
```bash
npm run chrome:start
```

### 3. Получить WebSocket endpoint
Команда `chrome:status` покажет актуальный endpoint:
```
🔌 WebSocket Endpoint: ws://localhost:9222/devtools/browser/12345678-1234-1234-1234-123456789abc
```

### 4. Добавить endpoint в .env (опционально)
```bash
CHROME_CDP_ENDPOINT=ws://localhost:9222/devtools/browser/YOUR-BROWSER-ID
```

## 📋 Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run chrome:status` | Проверить статус и показать endpoint |
| `npm run chrome:start` | Запустить Chrome с отладкой |
| `npm run chrome:stop` | Завершить все процессы Chrome |
| `npm run chrome:restart` | Перезапустить Chrome |

## 🔧 Конфигурация .env

### Автоматическое определение endpoint (рекомендуется):
```bash
USER_ID=001
AUTHORIZATION_NEEDED=false
BROWSER_OPEN=true
CHROME_CDP_ENDPOINT=
```

### Ручное указание endpoint:
```bash
USER_ID=001
AUTHORIZATION_NEEDED=false
BROWSER_OPEN=true
CHROME_CDP_ENDPOINT=ws://localhost:9222/devtools/browser/12345678-1234-1234-1234-123456789abc
```

## 🐛 Устранение проблем

### Chrome недоступен
```bash
# Проверить процессы
lsof -i :9222

# Завершить Chrome
npm run chrome:stop

# Запустить заново
npm run chrome:start
```

### WebSocket ошибка 404
- Browser endpoint изменился после перезапуска
- Удалите `CHROME_CDP_ENDPOINT` из .env для автоматического определения
- Или получите новый endpoint: `npm run chrome:status`

### Ошибка подключения
- Убедитесь, что Chrome запущен: `npm run chrome:status`
- Перезапустите Chrome: `npm run chrome:restart`
- Проверьте порт: `lsof -i :9222`

## 📡 Ручные команды

### macOS:
```bash
# Завершить Chrome
killall "Google Chrome"

# Запустить с CDP
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug-profile \
  --disable-web-security \
  --disable-features=VizDisplayCompositor
```

### Windows:
```cmd
# Завершить Chrome
taskkill /f /im chrome.exe

# Запустить с CDP
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir=C:\temp\chrome-debug-profile ^
  --disable-web-security ^
  --disable-features=VizDisplayCompositor
```

### Получение endpoint через API:
```bash
# Информация о браузере
curl http://localhost:9222/json/version

# Список вкладок
curl http://localhost:9222/json/list
``` 