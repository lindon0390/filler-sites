# Устранение неполадок и исправление ошибок

Это руководство поможет решить основные проблемы, которые могут возникнуть при работе с проектом.

## 🔧 Исправленные ошибки TypeScript

### 1. Ошибки типов в тестах

**Проблема**: Несоответствие интерфейсов между новым форматом JSON (`FullUserData`) и старым (`UserData`).

**Решение**: Создана функция конвертации `convertToLegacyFormat()` в файле `tests/evisa-vietnam-fixed.spec.ts`.

```typescript
function convertToLegacyFormat(newData: FullUserData): UserData {
  return {
    surname: newData.personalInformation.surname,
    name: newData.personalInformation.middleAndGivenName,
    // ... остальные поля
  };
}
```

### 2. Ошибки селекторов в Page Object

**Проблема**: Неправильное использование Locator в `selectOption()`.

**Решение**: Замена на строковый селектор с обработкой ошибок:

```typescript
try {
  await this.page.selectOption('select[id*="GioiTinh"]', data.personalInformation.sex);
} catch {
  await this.page.click('.ant-select:has-text("Sex")');
  await this.page.click(`text=${data.personalInformation.sex}`);
}
```

### 3. Ошибки в test.skip()

**Проблема**: Неправильный синтаксис `test.skip()` в Playwright.

**Решение**: Добавлен параметр `condition`:

```typescript
// Неправильно
test.skip('Причина пропуска');

// Правильно
test.skip(true, 'Причина пропуска');
```

## 📁 Структура файлов

### Рабочие тесты:
- ✅ `tests/evisa-vietnam-fixed.spec.ts` - Исправленная версия с правильными типами
- ✅ `tests/evisa-vietnam-login-simple.spec.ts` - Тест с авторизацией
- ✅ `tests/multi-user.spec.ts` - Многопользовательские тесты

### Устаревшие файлы:
- ⚠️ `tests/evisa-vietnam.spec.ts` - Имеет ошибки типов
- ⚠️ `tests/evisa-vietnam-login.spec.ts` - Слишком сложный

## 🚀 Рекомендуемые команды для запуска

### Проверка проекта на ошибки:
```bash
npm run lint
# или
npm run build
```

### Запуск тестов:
```bash
# Исправленная версия (рекомендуется)
npm run test:evisa-fixed:headed

# Тест с авторизацией
npm run test:evisa-simple:headed

# Многопользовательские тесты
npm run test:multi:headed
```

## 🔄 Совместимость форматов данных

### Новый формат JSON:
```json
{
  "personalInformation": {
    "surname": "DONDOKOV",
    "middleAndGivenName": "TIMUR"
  },
  "images": {
    "portraitPhoto": "files/001/imgPhoto.jpg",
    "passportDataPage": "files/001/imgPassport.jpg"
  }
}
```

### Старый формат (legacy):
```json
{
  "surname": "DONDOKOV",
  "name": "TIMUR",
  "imgPhotoFilename": "files/001/imgPhoto.jpg",
  "imgPassportFilename": "files/001/imgPassport.jpg"
}
```

## 📝 TypeScript конфигурация

Добавлен файл `tsconfig.json` для проверки типов:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "noEmit": true
  },
  "include": ["tests/**/*", "pages/**/*", "utils/**/*"]
}
```

## 🐛 Частые проблемы

### 1. "Property does not exist on type"

**Причина**: Несоответствие структуры JSON и TypeScript интерфейса.

**Решение**: 
- Используйте `tests/evisa-vietnam-fixed.spec.ts`
- Или обновите JSON файл под нужный интерфейс

### 2. "Module has no exported member"

**Причина**: Неправильный импорт (named vs default export).

**Решение**:
```typescript
// Правильно
import EvisaVietnamPage, { UserData } from '../pages/evisaVietnam.page';

// Неправильно
import { EvisaVietnamPage, UserData } from '../pages/evisaVietnam.page';
```

### 3. Ошибки селекторов на сайте

**Причина**: Сайт изменил структуру HTML.

**Решение**: 
- Обновить селекторы в Page Object файлах
- Использовать более гибкие селекторы с fallback вариантами

## 📊 Статус файлов проекта

| Файл | Статус | Описание |
|------|--------|----------|
| `tests/evisa-vietnam-fixed.spec.ts` | ✅ Работает | Исправленная версия теста |
| `tests/evisa-vietnam-login-simple.spec.ts` | ✅ Работает | Тест с авторизацией |
| `pages/evisaVietnamLoginFlow.page.ts` | ✅ Работает | Page Object для полного процесса |
| `files/001/001.json` | ✅ Работает | Обновленная структура данных |
| `tsconfig.json` | ✅ Добавлен | TypeScript конфигурация |
| `tests/evisa-vietnam.spec.ts` | ⚠️ Ошибки типов | Требует исправления |
| `tests/evisa-vietnam-login.spec.ts` | ⚠️ Сложный | Работает, но сложно поддерживать |

## 💡 Рекомендации для разработки

1. **Всегда запускайте проверку типов** перед коммитом:
   ```bash
   npm run lint
   ```

2. **Используйте исправленные версии тестов** для новых разработок

3. **Обновляйте селекторы** если сайт изменился

4. **Тестируйте по частям** - сначала отдельные компоненты, потом полный процесс

5. **Сохраняйте скриншоты** для диагностики проблем

---

**При возникновении новых проблем, обновляйте эту документацию! 📝** 

# 🔧 Устранение неполадок

## 🐛 Исправленные проблемы

### ✅ Неправильные селекторы заголовков формы заявления

**Проблема:** Тест падал на методе `aVerifyFormReady()` из-за неправильных селекторов в `ApplicationFormPage`.

**Симптомы:**
- Тест не мог найти разделы формы
- Ошибки типа "element not found" для заголовков разделов
- Кнопка "Next" была отключена, но тест не мог определить причину

**Причина:** Селекторы в Page Object не соответствовали реальным заголовкам на странице Vietnam E-Visa.

**❌ Было:**
```typescript
this.ePersonalInformationSection = page.locator('h3:has-text("PERSONAL INFORMATION")');
this.eTripInformationSection = page.locator('h3:has-text("TRIP INFORMATION")');
```

**✅ Исправлено:**
```typescript
this.ePersonalInformationSection = page.locator('h3:has-text("1. PERSONAL INFORMATION")');
this.eTripInformationSection = page.locator('h3:has-text("6. INFORMATION ABOUT THE TRIP")');
```

**Реальные заголовки на странице:**
1. "1. PERSONAL INFORMATION"
2. "2. REQUESTED INFORMATION"  
3. "3. PASSPORT INFORMATION"
4. "4. CONTACT INFORMATION"
5. "5. OCCUPATION"
6. "6. INFORMATION ABOUT THE TRIP"
7. "7. Accompany child(ren) under 14 years old..."
8. "8. TRIP'S EXPENSES, INSURANCE"

**Исправления:**
- ✅ Добавлены номера разделов (1., 2., 3., и т.д.)
- ✅ Исправлено название раздела "TRIP INFORMATION" → "INFORMATION ABOUT THE TRIP"
- ✅ Добавлены все 8 разделов формы
- ✅ Исправлена кнопка "Next Step" → "Next"
- ✅ Улучшена проверка активности кнопки Next

**Статус:** ✅ **Исправлено**

---

## 🔍 Отладка селекторов с помощью MCP Playwright

### Как проверить селекторы на реальной странице:

1. **Подключиться к открытому браузеру:**
   ```bash
   # Настроить .env для подключения к открытому Chrome
   BROWSER_OPEN=true
   ```

2. **Использовать MCP Playwright для проверки:**
   ```bash
   # Проверить список вкладок
   mcp_playwright_browser_tab_list
   
   # Сделать снимок страницы для анализа
   mcp_playwright_browser_snapshot
   
   # Кликнуть на элемент для проверки селектора
   mcp_playwright_browser_click
   ```

3. **Анализировать структуру страницы:**
   - Проверить точные тексты заголовков
   - Убедиться в правильности атрибутов элементов
   - Проверить состояние кнопок (enabled/disabled)

### Полезные команды для отладки браузера:

```bash
# Проверить статус Chrome
npm run chrome:status

# Запустить Chrome с отладочным портом
npm run chrome:start

# Получить актуальный WebSocket endpoint
curl http://localhost:9222/json/version

# Посмотреть все открытые вкладки
curl http://localhost:9222/json/list
```

---

## 📋 Рекомендации по созданию надёжных селекторов

### ✅ Лучшие практики:

1. **Проверять селекторы на реальной странице:**
   - Использовать MCP Playwright для анализа структуры
   - Всегда сверяться с актуальным содержимым страницы

2. **Использовать точные тексты:**
   ```typescript
   // ✅ Хорошо - точный текст с номером
   page.locator('h3:has-text("1. PERSONAL INFORMATION")')
   
   // ❌ Плохо - неточный текст без номера
   page.locator('h3:has-text("PERSONAL INFORMATION")')
   ```

3. **Добавлять fallback варианты:**
   ```typescript
   // Основной селектор
   const primarySelector = page.locator('h3:has-text("1. PERSONAL INFORMATION")');
   
   // Fallback для изменений на сайте
   const fallbackSelector = page.locator('h3').filter({ hasText: /PERSONAL.*INFORMATION/i });
   ```

4. **Проверять состояние элементов:**
   ```typescript
   // Проверить, что кнопка активна перед кликом
   await expect(this.eNextButton).toBeEnabled({ timeout: 5000 });
   ```

### ❌ Частые ошибки:

- Игнорирование номеров в заголовках
- Использование неточных текстов
- Не проверка состояния элементов
- Отсутствие таймаутов для ожидания

---

## 🛠️ Инструменты для отладки

### Chrome DevTools Protocol:
- Проверка структуры страницы
- Мониторинг изменений DOM
- Анализ состояния элементов

### MCP Playwright:
- Подключение к открытому браузеру
- Интерактивная отладка селекторов
- Снимки состояния страницы

### Playwright Inspector:
```bash
npm run test:debug
```

---

**Дата обновления:** 22.01.2025  
**Версия:** v2.1 - Исправлены селекторы формы заявления 