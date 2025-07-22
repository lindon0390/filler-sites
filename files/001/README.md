# Vietnam E-Visa JSON Структура данных

Этот файл содержит полную структуру данных для заполнения формы заявления на электронную визу Вьетнама.

## Структура файла

### 1. personalInformation (Личная информация)
- `surname` - Фамилия (как в паспорте)
- `middleAndGivenName` - Имя и отчество (обязательное поле)
- `dateOfBirth` - Дата рождения в формате DD/MM/YYYY
- `dateOfBirthType` - Тип даты рождения: "D" (полная дата) или "Y" (только год)
- `sex` - Пол: "Male" или "Female"
- `nationality` - Национальность (например: "Russia")
- `identityCard` - Номер удостоверения личности (необязательно)
- `email` - Электронная почта
- `agreeCreateAccount` - Согласие на создание аккаунта по email (true/false)
- `religion` - Религия
- `placeOfBirth` - Место рождения
- `reEnterEmail` - Повторный ввод email
- `hasOtherPassports` - Использовали ли другие паспорта для въезда во Вьетнам: "No"/"Yes"
- `otherPassports` - Массив других паспортов (если hasOtherPassports = "Yes"):
  - `passportNumber` - Номер паспорта
  - `fullName` - Полное имя (как в паспорте)
  - `dateOfBirth` - Дата рождения (DD/MM/YYYY)
  - `nationality` - Национальность
- `hasMultipleNationalities` - Есть ли несколько гражданств: "No"/"Yes"
- `violationOfVietnameseLaws` - Нарушения вьетнамского законодательства: "No"/"Yes"

### 2. requestedInformation (Запрашиваемая информация)
- `visaType` - Тип визы: "Single-entry" или "Multiple-entry"
- `validFrom` - Дата начала действия визы (DD/MM/YYYY)
- `validTo` - Дата окончания действия визы (DD/MM/YYYY)

### 3. passportInformation (Информация о паспорте)
- `passportNumber` - Номер паспорта
- `issuingAuthority` - Орган выдачи паспорта
- `type` - Тип паспорта (обычно "P" для обычного паспорта)
- `dateOfIssue` - Дата выдачи паспорта (DD/MM/YYYY)
- `expiryDate` - Дата окончания действия паспорта (DD/MM/YYYY)
- `holdOtherValidPassports` - Есть ли другие действующие паспорта: "No"/"Yes"
- `otherValidPassports` - Массив других действующих паспортов (если holdOtherValidPassports = "Yes"):
  - `type` - Тип паспорта
  - `otherTypeSpecify` - Уточнение типа (если выбран "Others")
  - `passportNumber` - Номер паспорта
  - `issuingAuthority` - Орган выдачи/место выдачи
  - `dateOfIssue` - Дата выдачи (DD/MM/YYYY)
  - `expiryDate` - Дата окончания действия (DD/MM/YYYY)

### 4. contactInformation (Контактная информация)
- `permanentResidentialAddress` - Постоянный адрес проживания
- `contactAddress` - Контактный адрес
- `telephoneNumber` - Номер телефона
- `emergencyContact` - Экстренный контакт:
  - `fullName` - Полное имя
  - `currentResidentialAddress` - Текущий адрес проживания
  - `telephoneNumber` - Номер телефона
  - `relationship` - Родственная связь

### 5. occupation (Профессия)
- `occupation` - Профессия
- `occupationInfo` - Дополнительная информация о профессии
- `nameOfCompanyAgencySchool` - Название компании/агентства/школы
- `positionCourseOfStudy` - Должность/курс обучения
- `addressOfCompanyAgencySchool` - Адрес компании/агентства/школы
- `companyAgencySchoolPhoneNumber` - Телефон компании/агентства/школы

### 6. tripInformation (Информация о поездке)
- `purposeOfEntry` - Цель въезда
- `intendedDateOfEntry` - Планируемая дата въезда (DD/MM/YYYY)
- `intendedLengthOfStay` - Планируемая продолжительность пребывания
- `phoneNumberInVietnam` - Номер телефона во Вьетнаме
- `residentialAddressInVietnam` - Адрес проживания во Вьетнаме
- `provinceCity` - Провинция/город
- `wardCommune` - Район/коммуна
- `intendedBorderGateOfEntry` - Планируемый пункт въезда
- `intendedBorderGateOfExit` - Планируемый пункт выезда
- `committedToDeclareTempResidence` - Обязательство декларировать временное проживание (true/false)
- `hasAgencyOrganizationContact` - Есть ли контакт с агентством/организацией: "No"/"Yes"
- `beenToVietnamLastYear` - Были ли во Вьетнаме в прошлом году: "No"/"Yes"
- `vietnamVisitsLastYear` - Массив поездок во Вьетнам за последний год (если beenToVietnamLastYear = "Yes"):
  - `fromDate` - Дата начала поездки (DD/MM/YYYY)
  - `toDate` - Дата окончания поездки (DD/MM/YYYY)
  - `purposeOfTrip` - Цель поездки
- `hasRelativesInVietnam` - Есть ли родственники во Вьетнаме: "No"/"Yes"

### 7. accompanyChildren (Сопровождающие дети)
Массив детей до 14 лет, путешествующих по одному паспорту

### 8. tripsExpensesInsurance (Расходы и страхование)
- `intendedExpensesUSD` - Планируемые расходы в долларах США
- `didBuyInsurance` - Приобреталась ли страховка: "Yes"/"No"
- `whoCoversTripExpenses` - Кто покрывает расходы на поездку

### 9. images (Изображения)
- `portraitPhoto` - Путь к портретному фото (например: "files/001/001-01.jpg")
- `passportDataPage` - Путь к странице данных паспорта (например: "files/001/001-02.jpg")

### 10. declaration (Декларация)
- `agreed` - Согласие с условиями (true/false)

## Использование

1. Скопируйте структуру из файла `001.json`
2. Заполните все необходимые поля своими данными
3. Убедитесь, что все обязательные поля заполнены
4. Проверьте форматы дат (DD/MM/YYYY)
5. Загрузите необходимые изображения (фото и паспорт)

## Примечания

- Все даты должны быть в формате DD/MM/YYYY
- Обязательные поля отмечены знаком "*" в веб-форме
- Размер фотографий должен быть менее 2MB
- Фото должно быть в формате JPG или JPEG
- Паспорт должен быть действителен минимум 6 месяцев
- При выборе "Yes" для hasOtherPassports появляется таблица для ввода информации о других паспортах
- Можно добавить несколько записей в массив otherPassports для нескольких паспортов
- При выборе "Yes" для holdOtherValidPassports появляется таблица для ввода информации о других действующих паспортах
- При выборе "Yes" для beenToVietnamLastYear появляется таблица для ввода информации о предыдущих поездках во Вьетнам
- Можно добавить несколько записей в массивы otherValidPassports и vietnamVisitsLastYear для нескольких паспортов/поездок

## Файлы изображений

В папке `files/001/` должны находиться следующие файлы:
- **001-01.jpg** - Портретное фото (паспортный тип)
- **001-02.jpg** - Страница паспорта с данными

Требования к изображениям:
- Формат: JPG/JPEG
- Размер: менее 2MB каждое
- Качество: достаточное для чтения текста паспорта 