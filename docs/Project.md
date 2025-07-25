# Vietnam E-Visa Automation Service

## 📋 Обзор проекта

### Цель проекта
Создание веб-сервиса для автоматизации заполнения анкеты на электронную визу во Вьетнам. Система должна обеспечивать надежное, безопасное и эффективное заполнение форм с минимальным вмешательством пользователя.

### Бизнес-требования
- **Автоматизация процесса:** Сокращение времени заполнения формы с 30+ минут до 2-3 минут
- **Точность данных:** Минимизация ошибок при заполнении анкеты
- **Масштабируемость:** Поддержка множественных пользователей и форм
- **Безопасность:** Защита персональных данных и соответствие GDPR
- **Надежность:** Стабильная работа в различных условиях сети

## 🏗️ Архитектура системы

### Технологический стек
- **Frontend Automation:** Playwright (TypeScript)
- **Browser Management:** Chrome DevTools Protocol (CDP)
- **Configuration Management:** Environment variables (.env)
- **Data Storage:** JSON files for user data
- **Testing Framework:** Playwright Test Runner
- **Documentation:** Markdown with structured approach

### Архитектурные принципы
1. **Page Object Model (POM):** Разделение логики страниц и тестов
2. **Dependency Injection:** Конфигурация через environment variables
3. **Separation of Concerns:** Разделение UI, бизнес-логики и данных
4. **Fail-Safe Design:** Graceful handling of errors and edge cases
5. **Extensibility:** Легкое добавление новых форм и сайтов
6. **Field Utils Pattern:** Вынесение логики работы с полями в отдельные утилиты

### Новая архитектура работы с полями (v2.5)

#### Принципы рефакторинга:
- **Разделение ответственности:** Логика работы с полями вынесена в `utils/fieldUtils.ts`
- **Переиспользование:** Утилиты можно использовать в разных POM
- **Чистота кода:** POM содержит только методы поиска, заполнения и проверки
- **Масштабируемость:** Легко добавлять новые типы полей в утилиты

#### Структура утилит (`utils/fieldUtils.ts`):
```typescript
export class FieldUtils {
  // Получение номера поля из классификации
  getFieldNumber(fieldName: string): string
  
  // Заполнение простых текстовых полей
  async fillSimpleTextField(fieldName: string, value: string, locator: Locator): Promise<void>
  
  // Заполнение радио кнопок
  async fillRadioButton(fieldName: string, value: string, locator: Locator): Promise<void>
  
  // Проверка текстовых полей
  async verifySimpleTextField(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean>
  
  // Проверка радио кнопок
  async verifyRadioButton(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean>
}
```

#### Структура POM (`pages/personalInformationTestPage.page.ts`):
```typescript
export class PersonalInformationTestPage {
  // Методы поиска полей
  async aFindSurnameField(): Promise<Locator | null>
  async aFindMiddleAndGivenNameField(): Promise<Locator | null>
  async aFindDateOfBirthTypeRadioByValue(value: string): Promise<Locator | null>
  
  // Методы заполнения полей
  async aFillSurnameField(surname: string): Promise<void>
  async aFillMiddleAndGivenNameField(givenName: string): Promise<void>
  async aFillDateOfBirthTypeField(dateType: string): Promise<void>
  
  // Методы проверки полей
  async aVerifySurnameField(expectedSurname: string): Promise<boolean>
  async aVerifyMiddleAndGivenNameField(expectedGivenName: string): Promise<boolean>
  async aVerifyDateOfBirthTypeField(expectedType: string): Promise<boolean>
}
```

#### Преимущества новой архитектуры:
1. **Чистота кода:** POM содержит только специфичную логику поиска полей
2. **Переиспользование:** Утилиты можно использовать в разных POM
3. **Тестируемость:** Каждый компонент можно тестировать отдельно
4. **Масштабируемость:** Легко добавлять новые типы полей
5. **Поддержка:** Проще поддерживать и отлаживать код

### Core Components

#### **Pages (Page Object Models)**
- **`applicationFormPage.page.ts`** - Основной POM для полной формы заявки
- **`personalInformationTestPage.page.ts`** - Специализированный POM для отладки полей Personal Information
- **`loginPage.page.ts`** - POM для страницы авторизации
- **`mainPage.page.ts`** - POM для главной страницы

#### **Utils (Утилиты)**
- **`fieldUtils.ts`** - Универсальные методы для работы с различными типами полей
- **`browserConnect.ts`** - Подключение к существующему браузеру Chrome
- **`envConfig.ts`** - Конфигурация окружения
- **`userManager.js`** - Управление данными пользователей

#### **Tests (Тесты)**
- **`evisa-vietnam-full-flow.spec.ts`** - Полный тест заполнения формы
- **`personal-information-debug.spec.ts`** - Отладочный тест для полей Personal Information

### Architectural Principles

#### **Field Utils Pattern (v2.7)**
**Принципы:**
- **Разделение ответственности** - POM содержит только локаторы и вызовы утилит
- **Переиспользуемость** - общая логика в FieldUtils
- **Безопасность** - специфичные локаторы без конфликтов
- **Единообразие** - единый паттерн для всех типов полей

**Структура:**
```typescript
// POM - только локаторы и вызовы
async aFillRadioField(value: string): Promise<void> {
  const radioLocators = {
    'Option1': this.eRadioOption1,
    'Option2': this.eRadioOption2
  };
  await this.fieldUtils.fillRadioButtonGroup('fieldName', value, radioLocators);
}

// FieldUtils - вся бизнес-логика
async fillRadioButtonGroup(fieldName: string, expectedValue: string, radioLocators: { [key: string]: Locator }): Promise<void>
```

**Преимущества:**
- **Масштабируемость** - легко добавлять новые поля
- **Читаемость** - чёткое разделение по типам полей
- **Надёжность** - проверка состояния перед действием
- **Диагностика** - подробное логирование состояния

### Компоненты системы

#### 1. Core Components
```
├── pages/                    # Page Object классы
│   ├── applicationFormPage.page.ts  # Форма заявления
│   ├── loginPage.page.ts     # Страница авторизации
│   ├── mainPage.page.ts      # Главная страница
│   └── personalInformationTestPage.page.ts  # Отладочный POM для Personal Information
├── utils/                    # Утилиты и хелперы
│   ├── browserConnect.ts     # Подключение к браузеру
│   ├── envConfig.ts         # Конфигурация окружения
│   ├── fieldUtils.ts        # Утилиты для работы с полями формы
│   └── index.ts             # Экспорты
└── tests/                    # Тестовые сценарии
    ├── evisa-vietnam-full-flow.spec.ts
    └── personal-information-debug.spec.ts  # Отладочные тесты
```

#### 2. Data Management
```
├── files/                   # Пользовательские данные
│   ├── 001/                # Пользователь 001
│   ├── 002/                # Пользователь 002
│   └── 003/                # Пользователь 003
└── userData.json           # Общие настройки
```

#### 3. Configuration
```
├── .env                     # Environment variables
├── playwright.config.ts     # Playwright конфигурация
└── tsconfig.json           # TypeScript конфигурация
```

## 🔧 Технические требования

### Производительность
- **Время выполнения:** < 3 минут для полного цикла
- **Успешность:** > 95% успешных заполнений
- **Параллельность:** Поддержка до 5 одновременных сессий
- **Memory Usage:** < 500MB на сессию

### Безопасность
- **Data Encryption:** Шифрование чувствительных данных
- **Session Management:** Безопасное управление сессиями браузера
- **Access Control:** Контроль доступа к пользовательским данным
- **Audit Trail:** Логирование всех операций

### Надежность
- **Error Handling:** Graceful обработка всех типов ошибок
- **Retry Logic:** Автоматические повторы при сбоях
- **Monitoring:** Мониторинг состояния системы
- **Backup:** Резервное копирование конфигураций

## 📊 Функциональные требования

### Core Features
1. **Автоматическая авторизация**
   - Заполнение email/пароля
   - Обработка капчи (ручная/автоматическая)
   - Валидация успешной авторизации

2. **Умное заполнение форм**
   - Проверка уже заполненных полей
   - Заполнение только необходимых полей
   - Валидация введенных данных

3. **Управление файлами**
   - Загрузка фотографий
   - Загрузка сканов паспорта
   - Валидация форматов файлов

## 🎯 Последние достижения (24.07.2025)

### ✅ Завершена классификация полей анкеты
**Статус:** Завершено  
**Документ:** `docs/field-classification.md`

**Результаты:**
- Проанализировано 59 полей в 9 разделах анкеты
- Классифицированы по 7 типам заполнения и 2 типам видимости
- Выявлены все зависимости между полями
- Установлена правильная нумерация согласно сайту

**Ключевые открытия:**
- **9 радио-кнопок** (Date of birth type, Has other passports, Visa type, etc.)
- **8 поисковых полей** (Nationality, Type, Purpose of entry, Province/city, etc.)
- **8 полей дат** (Date of birth, Date of issue, Expiry date, etc.)
- **Критические зависимости:** 6.7 зависит от 6.6, 2.3 должно быть +90 дней от 2.2

### ✅ Исправлена проблема с полем "Intended border gate of exit"
**Статус:** Завершено  
**Файл:** `pages/applicationFormPage.page.ts`

**Проблема:**
- Поле "Intended border gate of exit" не заполнялось, хотя в логах показывалось как заполненное
- Код находил элемент с нужным значением, но он относился к полю въезда, а не выезда

**Решение:**
- Улучшен метод `aIsAntDesignSelectFilled` для точной проверки принадлежности элемента к полю
- Добавлена проверка label и атрибутов элемента
- Добавлено различение полей "entry" и "exit" по ключевым словам
- Исправлены ошибки TypeScript

**Результат:**
- Поле "Intended border gate of exit" теперь корректно заполняется
- Улучшена точность проверки заполненности всех полей
- Добавлена поддержка различения похожих полей

### 📈 Влияние на архитектуру
- Создана полная карта полей для разработки автозаполнения
- Определены поля, требующие специальной обработки
- Установлены правила валидации и зависимостей
- Подготовлена основа для умного автозаполнения
- Улучшена надежность проверки заполненности полей

### Многопользовательская поддержка**
   - Изоляция данных пользователей
   - Переключение между профилями
   - Конфигурация per-user

### Advanced Features
1. **Ant Design Select Handling**
   - Специальная обработка сложных компонентов
   - Многоязычная поддержка (русский/английский)
   - Частичные совпадения для сложных названий

2. **Chrome CDP Integration**
   - Подключение к открытому браузеру
   - Автоматическое получение WebSocket endpoint
   - Управление сессиями браузера

3. **Intelligent Form Detection**
   - Автоматическое определение структуры формы
   - Адаптация к изменениям на сайте
   - Fallback механизмы для селекторов

## 🚀 Этапы разработки

### Phase 1: Foundation (✅ Завершено)
- [x] Базовая архитектура проекта
- [x] Page Object Model структура
- [x] Подключение к Chrome CDP
- [x] Базовое заполнение форм

### Phase 2: Intelligence (✅ Завершено)
- [x] Умная проверка заполненных полей
- [x] Ant Design Select обработка
- [x] Многоязычная поддержка
- [x] Обработка ошибок и retry логика

### Phase 3: Scalability (🔄 В процессе)
- [ ] Многопользовательская архитектура
- [ ] Конфигурация через UI
- [ ] Мониторинг и метрики
- [ ] API для интеграции

### Phase 4: Production (📋 Планируется)
- [ ] Docker контейнеризация
- [ ] CI/CD pipeline
- [ ] Production мониторинг
- [ ] Автоматическое масштабирование

## 🔍 Стандарты и конвенции

### Code Standards
- **TypeScript:** Строгая типизация всех данных
- **ESLint:** Автоматическая проверка кода
- **Prettier:** Единообразное форматирование
- **JSDoc:** Документирование методов

### Naming Conventions
```typescript
// Локаторы элементов
readonly eInputSurname: Locator;
readonly eBtnSubmit: Locator;

// Методы действий
async aFillForm(data: UserData): Promise<void>
async aClickSubmit(): Promise<void>

// Методы проверки
async aCheckFormVisibility(): Promise<boolean>
async aValidateData(): Promise<boolean>
```

### Error Handling
```typescript
try {
  await this.aFillField(field, value);
} catch (error) {
  console.log(`⚠️ Ошибка заполнения поля: ${error}`);
  // Graceful fallback
  await this.aFillFieldFallback(field, value);
}
```

## 📈 Метрики и KPI

### Performance Metrics
- **Время выполнения:** Среднее время заполнения формы
- **Success Rate:** Процент успешных заполнений
- **Error Rate:** Частота ошибок по типам
- **Resource Usage:** Использование памяти и CPU

### Quality Metrics
- **Code Coverage:** > 80% покрытие тестами
- **Bug Rate:** < 5% критических багов
- **Maintainability:** Индекс поддерживаемости кода
- **Documentation:** Актуальность документации

## 🔐 Безопасность

### Data Protection
- **Encryption:** Шифрование чувствительных данных
- **Access Control:** Ролевая модель доступа
- **Audit Logging:** Подробное логирование операций
- **Data Retention:** Политика хранения данных

### Compliance
- **GDPR:** Соответствие европейским стандартам
- **Data Minimization:** Минимизация собираемых данных
- **User Consent:** Явное согласие пользователей
- **Right to Delete:** Возможность удаления данных

### Работа с данными пользователей
- **Неизменность JSON файлов:** JSON файлы с данными пользователей (files/*/*.json) не должны изменяться
- **Реальные данные:** Файлы содержат реальные данные пользователей и должны оставаться неизменными
- **Тестирование:** При необходимости тестирования использовать копии файлов или создавать новые тестовые данные
- **Обратная совместимость:** Все изменения в логике работы с данными должны быть обратно совместимыми

## 🛠️ Инфраструктура

### Development Environment
- **Node.js:** v18+ для разработки
- **Chrome:** v120+ с CDP поддержкой
- **TypeScript:** v5+ для типизации
- **Playwright:** v1.40+ для автоматизации

### Production Environment
- **Docker:** Контейнеризация приложений
- **Kubernetes:** Оркестрация контейнеров
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)

## 📚 Документация

### Technical Documentation
- **[README.md](../README.md):** Основная документация
- **[docs/DEVELOPMENT.md](DEVELOPMENT.md):** Руководство разработчика
- **[docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md):** Устранение неполадок
- **[docs/ANT-DESIGN-SELECT-FIX.md](ANT-DESIGN-SELECT-FIX.md):** Специальные исправления

### Architecture Documentation
- **[docs/Project.md](Project.md):** Детальное описание проекта
- **[docs/Tasktracker.md](Tasktracker.md):** Отслеживание задач
- **[docs/Diary.md](Diary.md):** Технический дневник
- **[docs/qa.md](qa.md):** Вопросы и ответы

## 🐛 Исправленные проблемы

### v2.4 (24.07.2025) - Ant Design Select Fix
**Проблема:** Поля "Тип паспорта", "Страхование", "Расходы покрываются" неправильно определялись как не заполненные и перезаполнялись.

**Решение:**
- Создан новый метод `aIsAntDesignSelectFilled()` с улучшенной логикой проверки
- Добавлен маппинг названий полей для многоязычной поддержки
- Улучшена логика поиска с частичными совпадениями для сложных названий полей

**Результат:**
```
🔍 [DEBUG] Проверяем поле Тип паспорта с ожидаемым значением "Ordinary passport"
🔍 [DEBUG] Найдено элементов с "Ordinary passport": 1
✅ Тип паспорта: правильно заполнено (метод 1 - .ant-select-selection-item)
✅ Тип паспорта: уже заполнено правильно (Ordinary passport)
```

### v2.3 (22.01.2025) - Улучшена работа с выпадающими списками
- **Исправлены локаторы:** Email и Issuing Authority поля теперь используют placeholder
- **Улучшены выпадающие списки:** Добавлено ожидание закрытия списков и поиск по точному совпадению
- **Обработка readonly полей:** Добавлен JavaScript fallback для сложных полей

### v2.2 (22.01.2025) - Умное заполнение форм
- **Новая функция:** Автоматическая проверка уже заполненных полей
- **Логика:** Система сравнивает текущие значения с ожидаемыми и заполняет только необходимые поля
- **Результат:** Значительно ускорено заполнение форм и предотвращено перезаполнение корректных данных

### v2.1 (22.01.2025) - Исправлены селекторы формы заявления
- **Проблема:** Тест падал на методе `aVerifyFormReady()` из-за неправильных селекторов
- **Решение:** Обновлены все селекторы заголовков для соответствия реальным заголовкам с номерами
- **Результат:** Тест теперь корректно находит все 8 разделов формы

## 🚀 Функциональность

### ✅ Работает стабильно:
- ✅ Подключение к открытому Chrome через CDP
- ✅ Автоматическое получение WebSocket endpoint
- ✅ Загрузка главной страницы Vietnam E-Visa
- ✅ Процесс авторизации с капчей
- ✅ Переход к форме заявления через попап инструкций
- ✅ Проверка видимости всех разделов формы
- ✅ Многопользовательская система (files/001, 002, 003)
- ✅ Конфигурация через .env файл
- ✅ Page Object Model архитектура
- ✅ **Умное заполнение форм с проверкой уже заполненных полей**
- ✅ **Автоматическая проверка загруженных изображений**
- ✅ **Заполнение всех разделов формы (личные данные, паспорт, контакты, профессия, поездка, расходы)**
- ✅ **Обработка ошибок и продолжение работы при проблемах с отдельными полями**
- ✅ **Улучшенная работа с выпадающими списками (Ant Design компоненты)**
- ✅ **Специальная обработка адресов и провинций**
- ✅ **Исправленные локаторы для Email и Issuing Authority полей**

### 🔄 В разработке:
- ⏳ Исправление загрузки изображений (пути к файлам)
- ⏳ Улучшение поиска опций в выпадающих списках для адресов
- ⏳ Оптимизация производительности для больших форм

## 📋 Доступные команды

### Тестирование:
```bash
npm test                      # Основной тест
npm run test:headed          # С видимым браузером
npm run test:debug           # Режим отладки
npm run test:ui              # UI режим
```

### Управление Chrome:
```bash
npm run chrome:status        # ✅ Проверить статус и endpoint
npm run chrome:start         # ✅ Запустить Chrome с CDP
npm run chrome:stop          # ✅ Завершить Chrome
npm run chrome:restart       # ✅ Перезапустить Chrome
```

### Управление пользователями:
```bash
npm run user:list           # Список пользователей
npm run user:status         # Статус готовности
npm run user:switch         # Переключение пользователей
npm run user:create         # Создание нового пользователя
```

## 🎯 Следующие шаги

### Приоритет 1 - Критичные:
- [ ] Автоматическое заполнение обязательных полей формы
- [ ] Загрузка файлов изображений
- [ ] Обработка ошибок валидации формы

### Приоритет 2 - Важные:
- [ ] Автоматическое определение и заполнение условных полей
- [ ] Финальная отправка формы и получение результата
- [ ] Расширенное логирование и отчёты

### Приоритет 3 - Улучшения:
- [ ] Поддержка дополнительных сайтов для заполнения форм
- [ ] GUI интерфейс для управления
- [ ] Интеграция с CI/CD

---

**Версия документа:** v2.4  
**Последнее обновление:** 24.07.2025  
**Статус:** Активная разработка  
**Следующий релиз:** v3.0 - Production Ready 