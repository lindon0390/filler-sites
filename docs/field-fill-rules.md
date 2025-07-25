# Единая система правил заполнения полей

## Обзор

Система создана для унификации процесса заполнения полей анкеты e-Visa Vietnam согласно их типам, определенным в `field-classification.md`.

## ✅ Завершенная работа

### Обновленные методы заполнения разделов:
- ✅ `aFillPersonalInformationIfNeeded()` - Personal Information
- ✅ `aFillRequestedInformationIfNeeded()` - Requested Information  
- ✅ `aFillPassportInformationIfNeeded()` - Passport Information
- ✅ `aFillContactInformationIfNeeded()` - Contact Information
- ✅ `aFillOccupationIfNeeded()` - Occupation
- ✅ `aFillTripInformationIfNeeded()` - Trip Information
- ✅ `aFillTripExpensesIfNeeded()` - Trip Expenses
- ✅ `aCheckFinalDeclaration()` - Declaration
- ✅ `aUploadImagesIfNeeded()` - Images

### Реализованные типы полей:
- ✅ Тип 1: Простой инпут (simple_input) - 27 полей
- ✅ Тип 2: Выпадающий список (dropdown_select) - 8 полей
- ✅ Тип 3: Динамический список с поиском (large_dropdown) - 8 полей
- ✅ Тип 4: Зависимый динамический список с поиском (dependent_dropdown) - 1 поле
- ✅ Тип 5: Поле даты (date_picker) - 8 полей
- ✅ Тип 6: Радиокнопка (radio_button) - 9 полей
- ✅ Тип 7: Чекбокс (checkbox) - 3 поля
- ✅ Тип 8: Загрузка файла (file_upload) - 2 поля

## Типы полей

### Тип 1: Простой инпут (simple_input)
- **Описание:** Текстовые поля с прямым вводом
- **Примеры:** Фамилия, имя, email, адрес
- **Метод:** `aFillSimpleInputWithLog()`
- **Особенности:** 
  - Проверка readonly атрибута
  - Использование JavaScript для readonly полей
  - Проверка уже заполненных значений

### Тип 2: Выпадающий список (dropdown_select)
- **Описание:** Поля с фиксированным набором опций
- **Примеры:** Sex (Male/Female), Passport Type (Ordinary/Diplomatic/Official/Other), Occupation (Businessman/Employee/Official/Others/Retired/Student/Unemployed)
- **Метод:** `aFillDropdownSelectWithLog()`
- **Особенности:** Поддержка точного и частичного поиска опций

### Тип 3: Динамический список с поиском (large_dropdown)
- **Описание:** Ant Design Select с большим списком опций и возможностью поиска
- **Примеры:** Национальность, провинция, пункты въезда/выезда
- **Метод:** `aFillLargeDropdownWithLog()`
- **Особенности:**
  - Ввод текста в инпут для поиска
  - Динамическое изменение данных в списке
  - Множественные методы поиска
  - Таймаут 5 секунд для выпадающего списка
  - Поиск по точному тексту, регулярным выражениям, title, span

### Тип 4: Зависимый динамический список с поиском (dependent_dropdown)
- **Описание:** Динамический список с поиском, зависящий от другого поля
- **Примеры:** Район (зависит от провинции)
- **Метод:** `aFillDependentDropdownWithLog()`
- **Особенности:**
  - Проверка заполнения зависимого поля
  - Ожидание загрузки зависимых данных
  - Использование логики динамического списка с поиском
  - Ввод текста в инпут для поиска
  - Динамическое изменение данных в списке

### Тип 5: Поле даты (date_picker)
- **Описание:** Поля для выбора даты
- **Примеры:** Дата рождения, дата выдачи паспорта
- **Метод:** `aFillDatePickerWithLog()`
- **Особенности:**
  - Использование JavaScript для установки значения
  - Дополнительное заполнение через Playwright
  - Генерация событий input, change, blur

### Тип 6: Радиокнопка (radio_button)
- **Описание:** Радиокнопки Yes/No или одиночные
- **Примеры:** Другие паспорта, множественное гражданство
- **Метод:** `aFillRadioButtonWithLog()`
- **Особенности:**
  - Поддержка парных радиокнопок (Yes/No)
  - Поддержка одиночных радиокнопок
  - Проверка текущего состояния

### Тип 7: Чекбокс (checkbox)
- **Описание:** Флажки для согласия
- **Примеры:** Согласие на создание аккаунта, декларация
- **Метод:** `aFillCheckboxWithLog()`
- **Особенности:**
  - Проверка текущего состояния
  - Использование check()/uncheck() методов
  - Поддержка значений "Yes"/"true"

### Тип 8: Загрузка файла (file_upload)
- **Описание:** Поля для загрузки файлов
- **Примеры:** Фото, страница паспорта
- **Метод:** `aFillFileUploadWithLog()`
- **Особенности:**
  - Проверка уже загруженных файлов
  - Использование setInputFiles()
  - Ожидание загрузки файла

## Универсальный метод

### `aFillFieldByType()`
Главный метод для заполнения полей согласно их типу:

```typescript
async aFillFieldByType(
  field: Locator, 
  expectedValue: string, 
  fieldName: string, 
  section: string,
  fieldType: number,
  additionalParams?: any
): Promise<void>
```

**Параметры:**
- `field`: Локатор поля
- `expectedValue`: Ожидаемое значение
- `fieldName`: Название поля для логирования
- `section`: Раздел формы
- `fieldType`: Тип поля (1-7, undefined)
- `additionalParams`: Дополнительные параметры (для радиокнопок, зависимых полей)

## Конфигурация полей

### `fieldConfiguration`
Объект с конфигурацией всех полей согласно `field-classification.md`:

```typescript
private readonly fieldConfiguration = {
  'personalInformation.surname': { type: 1, section: 'Personal Information' },
  'personalInformation.sex': { type: 2, section: 'Personal Information' },
  'personalInformation.nationality': { type: 3, section: 'Personal Information' },
  'tripInformation.wardCommune': { 
    type: 4, 
    section: 'Trip Information',
    dependsOn: 'tripInformation.provinceCity'
  },
  // ... остальные поля
};
```

## Логирование

Все методы заполнения включают логирование через `aLogFieldFill()`:

```typescript
this.aLogFieldFill(section, fieldName, fieldName, expectedValue, actualValue, status, errorMessage?);
```

**Статусы:**
- `success`: Успешное заполнение
- `already_filled`: Поле уже заполнено правильно
- `error`: Ошибка при заполнении
- `skipped`: Поле пропущено
- `NOT_FOUND`: Опция не найдена в выпадающем списке
- `DEPENDENCY_NOT_MET`: Не выполнена зависимость
- `UPLOADED`: Файл загружен

## Использование

### Пример заполнения Personal Information:

```typescript
async aFillPersonalInformationIfNeeded(userData: any) {
  const personal = userData.personalInformation;
  
  // Простые текстовые поля (тип 1)
  await this.aFillFieldByType(this.eSurnameField, personal.surname, 'personalInformation.surname', 'Personal Information', 1);
  
  // Поле даты (тип 5)
  await this.aFillFieldByType(this.eDateOfBirthField, personal.dateOfBirth, 'personalInformation.dateOfBirth', 'Personal Information', 5);
  
  // Выпадающий список (тип 2)
  await this.aFillFieldByType(this.eSexSelect, personal.sex, 'personalInformation.sex', 'Personal Information', 2);
  
  // Большой выпадающий список (тип 3)
  await this.aFillFieldByType(this.eNationalitySelect, personal.nationality, 'personalInformation.nationality', 'Personal Information', 3);
  
  // Чекбокс (тип 7)
  await this.aFillFieldByType(this.eAgreeCreateAccountCheckbox, personal.agreeCreateAccount, 'personalInformation.agreeCreateAccount', 'Personal Information', 7);
  
  // Радиокнопки (тип 6)
  await this.aFillFieldByType(
    personal.hasOtherPassports === 'Yes' ? this.eOtherPassportsYes : this.eOtherPassportsNo,
    personal.hasOtherPassports,
    'personalInformation.hasOtherPassports',
    'Personal Information',
    6,
    { yesRadio: this.eOtherPassportsYes, noRadio: this.eOtherPassportsNo }
  );
}
```

## Преимущества

1. **Унификация:** Единый подход к заполнению всех типов полей
2. **Надежность:** Специализированные методы для каждого типа
3. **Логирование:** Полное отслеживание процесса заполнения
4. **Гибкость:** Поддержка дополнительных параметров
5. **Конфигурируемость:** Централизованная конфигурация полей
6. **Обработка ошибок:** Детальная обработка ошибок для каждого типа

## Результаты внедрения

### Статистика по типам полей:
- **Тип 1 (простой инпут):** 27 полей ✅
- **Тип 2 (выпадающий список):** 8 полей ✅
- **Тип 3 (динамический список с поиском):** 8 полей ✅
- **Тип 4 (зависимый динамический список с поиском):** 1 поле ✅
- **Тип 5 (выбор даты):** 8 полей ✅
- **Тип 6 (радио):** 9 полей ✅
- **Тип 7 (чекбокс):** 3 поля ✅
- **Тип 8 (загрузка файлов):** 2 поля ✅

### Обновленные разделы:
- ✅ Personal Information (15 полей)
- ✅ Requested Information (3 поля)
- ✅ Passport Information (6 полей)
- ✅ Contact Information (7 полей)
- ✅ Occupation (6 полей)
- ✅ Trip Information (13 полей)
- ✅ Trip Expenses (5 полей)
- ✅ Declaration (1 поле)
- ✅ Images (2 поля)

## Следующие шаги

1. ✅ ~~Обновить остальные методы заполнения разделов для использования логирования~~
2. 🔄 Добавить поддержку динамических таблиц (тип 2 в field-classification)
3. 🔄 Создать автоматическую генерацию конфигурации из field-classification.md
4. 🔄 Добавить валидацию типов полей
5. 🔄 Создать тесты для каждого типа заполнения
6. 🔄 Добавить поддержку условного заполнения полей
7. 🔄 Создать систему валидации данных перед заполнением 