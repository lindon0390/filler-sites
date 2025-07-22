# 🛠️ Руководство разработчика

Это руководство содержит детальную информацию для разработчиков, работающих с проектом автоматизации заполнения формы электронной визы Вьетнама.

## 🏗️ Архитектура проекта

### Page Object Model (POM)

Проект использует паттерн Page Object Model для организации кода:

```typescript
// Пример структуры Page Object класса
export default class EvisaVietnamPage {
    readonly page: Page;
    readonly eInputSurname: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.eInputSurname = page.locator('//input[@id="surname"]');
    }
    
    async aFillSurname(surname: string) {
        await this.eInputSurname.fill(surname);
    }
}
```

### Типизация данных

Все пользовательские данные типизированы через интерфейс `UserData`:

```typescript
export interface UserData {
    // Личные данные
    surname: string;
    name: string;
    birthDate: string;
    gender: 'male' | 'female';
    // ... остальные поля
}
```

## 📝 Соглашения по коду

### Именование элементов

1. **Локаторы элементов:** `eТипЭлемента`
   - `eInput` - поля ввода
   - `eButton` - кнопки  
   - `eSelect` - выпадающие списки
   - `eRadio` - радиокнопки
   - `eCheckbox` - чекбоксы

2. **Методы действий:** `aДействие`
   - `aFill` - заполнение
   - `aClick` - клик
   - `aSelect` - выбор
   - `aUpload` - загрузка

3. **Методы проверки:** `aCheckЧто`
   - `aCheckPage` - проверка страницы
   - `aCheckVisibility` - проверка видимости

### Примеры правильного именования

```typescript
// ✅ Правильно
readonly eInputSurname: Locator;
readonly eBtnSubmit: Locator;
readonly eSelectNationality: Locator;

async aFillPersonalData(userData: UserData) { }
async aClickSubmitButton() { }
async aCheckFormVisibility() { }

// ❌ Неправильно
readonly surnameInput: Locator;
readonly submitBtn: Locator;
readonly nationalityDropdown: Locator;

async fillData(data: any) { }
async clickButton() { }
async checkForm() { }
```

## 🔧 Добавление новых функций

### Добавление нового поля формы

1. **Обновите интерфейс UserData:**
```typescript
export interface UserData {
    // ... существующие поля
    newField: string; // Добавьте новое поле
}
```

2. **Добавьте локатор в Page Object:**
```typescript
readonly eInputNewField: Locator;

constructor(page: Page) {
    // ... существующие локаторы
    this.eInputNewField = page.locator('//input[@id="new-field-id"]');
}
```

3. **Создайте метод для заполнения:**
```typescript
async aFillNewField(value: string) {
    await this.eInputNewField.fill(value);
}
```

4. **Обновите userData.json:**
```json
{
    "newField": "значение для тестирования"
}
```

5. **Добавьте в общий метод заполнения:**
```typescript
async aFillAllData(userData: UserData) {
    // ... существующие вызовы
    await this.aFillNewField(userData.newField);
}
```

### Добавление новой страницы

1. **Создайте новый Page Object класс:**
```typescript
// pages/newPage.page.ts
import { expect, Locator, Page } from '@playwright/test';

export default class NewPage {
    readonly page: Page;
    readonly eMainElement: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eMainElement = page.locator('//div[@id="main"]');
    }

    async aCheckPage() {
        await expect(this.eMainElement).toBeVisible({ timeout: 10000 });
    }
}
```

2. **Добавьте тесты для новой страницы:**
```typescript
// tests/new-page.spec.ts
import { test } from '@playwright/test';
import NewPage from '../pages/newPage.page';

test.describe('New Page Tests', () => {
    test('should load new page', async ({ page }) => {
        await page.goto('https://example.com/new-page');
        
        const newPage = new NewPage(page);
        await newPage.aCheckPage();
    });
});
```

## 🎯 Селекторы и локаторы

### Предпочтительные типы селекторов

1. **XPath (предпочтительный):**
```typescript
// ✅ Рекомендуется - стабильный и точный
page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ten"]')
page.locator('//button[@type="submit"]')
```

2. **CSS селекторы:**
```typescript
// ✅ Приемлемо для простых случаев
page.locator('#element-id')
page.locator('.class-name')
```

3. **Playwright локаторы:**
```typescript
// ✅ Для стандартных элементов
page.getByRole('button', { name: 'Submit' })
page.getByText('Continue')
```

### Избегайте нестабильных селекторов

```typescript
// ❌ Избегайте - может сломаться при изменениях
page.locator('div > div > input') // слишком зависимо от структуры
page.locator('input:nth-child(3)') // зависимо от порядка элементов
```

## 🧪 Тестирование

### Структура тестов

```typescript
test.describe('Группа тестов', () => {
    test.beforeEach(async ({ page }) => {
        // Подготовка перед каждым тестом
        await page.goto(URL);
    });

    test('Описание теста', async ({ page }) => {
        // Подготовка
        const pageObject = new PageObject(page);
        
        // Действие
        await pageObject.aPerformAction();
        
        // Проверка
        await pageObject.aCheckResult();
    });
});
```

### Лучшие практики тестирования

1. **Используйте ожидания с таймаутами:**
```typescript
await expect(element).toBeVisible({ timeout: 10000 });
```

2. **Группируйте связанные проверки:**
```typescript
async aCheckFormFields() {
    await expect(this.eInputSurname).toBeVisible();
    await expect(this.eInputName).toBeVisible();
    await expect(this.eInputEmail).toBeVisible();
}
```

3. **Используйте значимые сообщения об ошибках:**
```typescript
await expect(element).toBeVisible({ 
    timeout: 10000,
    message: 'Поле фамилии должно быть видимым'
});
```

## 🔍 Отладка

### Отладочные методы

1. **Скриншоты:**
```typescript
// В любом месте теста
await page.screenshot({ path: 'debug-screenshot.png' });
```

2. **Логирование:**
```typescript
import { logWithTimestamp } from '../utils';

logWithTimestamp('Начинаем заполнение формы');
```

3. **Пауза для визуального контроля:**
```typescript
import { delay } from '../utils';

await delay(3000); // Пауза на 3 секунды
```

### Режимы отладки

```bash
# Пошаговая отладка
npm run test:debug

# Визуальная отладка
npm run test:headed

# UI режим для интерактивной отладки
npm run test:ui
```

## 📊 Monitoring и логирование

### Кастомные утилиты логирования

```typescript
import { logWithTimestamp, takeTimestampedScreenshot } from '../utils';

// Логирование с временной меткой
logWithTimestamp('Форма успешно заполнена');

// Скриншот с временной меткой
await takeTimestampedScreenshot(page, 'form-filled');
```

### Использование таймаутов

```typescript
import { TIMEOUTS } from '../utils';

// Различные таймауты для разных операций
await expect(element).toBeVisible({ timeout: TIMEOUTS.SHORT });
await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.PAGE_LOAD });
```

## 🚀 Оптимизация производительности

### Параллельное выполнение

```typescript
// Выполнение независимых действий параллельно
await Promise.all([
    this.aFillSurname(userData.surname),
    this.aFillName(userData.name),
    this.aFillEmail(userData.email)
]);
```

### Переиспользование браузерных контекстов

```typescript
// В playwright.config.ts
export default defineConfig({
    use: {
        // Переиспользование браузерного контекста
        reuseExistingServer: !process.env.CI,
    },
});
```

## 📋 Чек-лист для Pull Request

Перед созданием Pull Request убедитесь:

- [ ] Код соответствует соглашениям по именованию
- [ ] Добавлены типы для новых интерфейсов
- [ ] Обновлена документация при необходимости
- [ ] Тесты проходят успешно
- [ ] Нет использования реальных персональных данных
- [ ] Добавлены комментарии для сложной логики
- [ ] Использованы подходящие таймауты
- [ ] Селекторы стабильны и надежны

## 🔗 Полезные ссылки

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices for E2E Testing](https://playwright.dev/docs/best-practices) 