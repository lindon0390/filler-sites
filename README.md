# Filler Sites - Автоматизация форм с Playwright

Проект для автоматизации заполнения форм на различных сайтах с использованием Playwright.

## 🔧 Настройка

### Установка
```bash
npm install
```

### Переменные окружения (.env)
```bash
USER_ID=001                    # ID пользователя для данных
AUTHORIZATION_NEEDED=false     # Требуется ли авторизация
BROWSER_OPEN=false            # Подключение к существующему Chrome
CHROME_CDP_ENDPOINT=          # WebSocket endpoint для CDP подключения (опционально)
```

## 🌐 Подключение к открытому Chrome браузеру

### Запуск Chrome с поддержкой CDP (Chrome DevTools Protocol)

Для подключения к уже открытому Chrome браузеру нужно запустить его с параметром удаленной отладки:

#### macOS/Linux:
```bash
# Закрыть все экземпляры Chrome
killall "Google Chrome"

# Запустить Chrome с отладочным портом
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug-profile \
  --disable-web-security \
  --disable-features=VizDisplayCompositor
```

#### Windows:
```cmd
# Закрыть все экземпляры Chrome
taskkill /f /im chrome.exe

# Запустить Chrome с отладочным портом
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir=C:\temp\chrome-debug-profile ^
  --disable-web-security ^
  --disable-features=VizDisplayCompositor
```

#### Быстрый запуск через npm:
```bash
npm run chrome:debug
```

### Получение WebSocket endpoint для CDP подключения

После запуска Chrome с отладочным портом, можно получить актуальный endpoint:

#### 1. Через HTTP API:
```bash
# Получить информацию о браузере
curl http://localhost:9222/json/version

# Ответ будет содержать webSocketDebuggerUrl:
{
  "Browser": "Chrome/138.0.7204.158",
  "webSocketDebuggerUrl": "ws://localhost:9222/devtools/browser/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
}
```

#### 2. Список активных вкладок:
```bash
# Получить все открытые вкладки
curl http://localhost:9222/json/list

# Ответ покажет все активные вкладки с их endpoints
```

#### 3. Автоматическое получение (рекомендуется):
Код автоматически получает актуальный endpoint при подключении. Просто установите:
```bash
BROWSER_OPEN=true
```

#### 4. Ручное указание endpoint:
Если нужно принудительно использовать конкретный endpoint:
```bash
CHROME_CDP_ENDPOINT=ws://localhost:9222/devtools/browser/YOUR-BROWSER-ID
```

### Проверка доступности Chrome

```bash
# Проверить, запущен ли Chrome с CDP
curl http://localhost:9222/json/version

# Если команда вернула JSON - Chrome доступен
# Если ошибка - Chrome не запущен или запущен без --remote-debugging-port
```

## 🤖 Умное заполнение форм

### Проверка уже заполненных полей

Система автоматически проверяет уже заполненные поля и не перезаполняет их, если данные корректны:

- ✅ **Текстовые поля**: Сравнивает текущее значение с ожидаемым
- ✅ **Выпадающие списки**: Проверяет выбранные опции
- ✅ **Чекбоксы**: Проверяет состояние (отмечен/не отмечен)
- ✅ **Радиокнопки**: Проверяет выбранные варианты
- ✅ **Загруженные файлы**: Проверяет наличие загруженных изображений

### Логика работы

1. **Проверка изображений**: Система проверяет, загружены ли фото и паспорт
2. **Проверка полей**: Для каждого поля сравнивает текущее значение с ожидаемым
3. **Умное заполнение**: Заполняет только те поля, которые требуют изменений
4. **Логирование**: Подробные логи показывают, что уже заполнено, а что изменено

### Пример работы

```
📸 Проверяем загруженные изображения...
✅ Фото уже загружено
✅ Паспорт уже загружен

👤 Проверяем раздел "PERSONAL INFORMATION"...
✅ Фамилия: уже заполнено правильно (DONDOKOV)
✅ Имя: уже заполнено правильно (TIMUR)
📝 Пол: устанавливаем (было: "", нужно: "Male")
✅ Пол: установлено
```

### Преимущества

- 🚀 **Быстрота**: Не тратит время на повторное заполнение
- 🔒 **Безопасность**: Не изменяет уже корректные данные
- 📊 **Прозрачность**: Подробные логи показывают все действия
- 🛡️ **Надежность**: Обрабатывает ошибки и продолжает работу

### Устранение проблем

#### Chrome недоступен на порту 9222:
- Убедитесь, что Chrome запущен с параметром `--remote-debugging-port=9222`
- Проверьте, не занят ли порт другим процессом: `lsof -i :9222`
- Попробуйте другой порт (например, 9223) и обновите настройки

#### WebSocket ошибка 404:
- Browser endpoint изменился после перезапуска Chrome
- Используйте автоматическое получение endpoint (не указывайте `CHROME_CDP_ENDPOINT`)
- Или получите новый endpoint через `curl http://localhost:9222/json/version`

#### Ошибка подключения:
- Убедитесь, что Chrome запущен
- Проверьте, что используется правильный профиль пользователя
- Попробуйте перезапустить Chrome с отладочными параметрами

## 🚀 Использование

### Запуск тестов
```bash
# С новым браузером
BROWSER_OPEN=false npm test

# С подключением к открытому Chrome
BROWSER_OPEN=true npm test

# С конкретным endpoint
CHROME_CDP_ENDPOINT=ws://localhost:9222/devtools/browser/YOUR-ID npm test
```

### Примеры конфигурации .env

#### Новый браузер:
```bash
USER_ID=001
AUTHORIZATION_NEEDED=false
BROWSER_OPEN=false
```

#### Подключение к открытому Chrome:
```bash
USER_ID=001
AUTHORIZATION_NEEDED=false
BROWSER_OPEN=true
```

#### Подключение по конкретному endpoint:
```bash
USER_ID=001
AUTHORIZATION_NEEDED=false
BROWSER_OPEN=true
CHROME_CDP_ENDPOINT=ws://localhost:9222/devtools/browser/12345678-1234-1234-1234-123456789abc
```

## 📁 Структура проекта

```
filler-sites/
├── .env                      # Переменные окружения
├── utils/
│   ├── browserConnect.ts     # Подключение к браузеру
│   └── envConfig.ts         # Конфигурация окружения
├── tests/                   # Тесты
├── pages/                   # Page Object классы
└── files/                   # Данные пользователей
```

## 🔍 Отладка

Для отладки подключения к браузеру:
```bash
# Проверить статус Chrome
curl -s http://localhost:9222/json/version | jq

# Посмотреть все вкладки
curl -s http://localhost:9222/json/list | jq

# Запустить тест с подробными логами
DEBUG=pw:api npm test
```
