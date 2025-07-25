import { test, expect } from '@playwright/test';
import { ApplicationFormTestPage } from '../pages/applicationFormTestPage.page';
import { connectAndGetActivePage } from '../utils/browserConnect';
import { getEnvConfig } from '../utils/envConfig';
import * as fs from 'fs';
import * as path from 'path';

test.describe('🔧 Отладка полей всей анкеты E-Visa', () => {
  test('📝 Тест заполнения полей Personal Information (1.1, 1.2, 1.3, 1.5, 1.13) и Passport Information (3.3)', async () => {
    // Подключаемся к существующему Chrome
    const { page } = await connectAndGetActivePage();
    
    // Проверяем, что мы на правильной странице
    const pageTitle = await page.title();
    console.log(`✅ Подключились к странице: "${pageTitle}"`);
    
    // Создаём экземпляр POM
    const applicationFormTestPage = new ApplicationFormTestPage(page);
    
    // Проверяем страницу E-Visa
    await applicationFormTestPage.aCheckEvisaPage();
    
    // Загружаем данные пользователя
    const config = getEnvConfig();
    const userId = config.userId;
    const userDataPath = path.join(__dirname, `../files/${userId}/${userId}.json`);
    const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    
    console.log('🔧 Загружена конфигурация из .env:');
    console.log(`   👤 USER_ID: ${process.env.USER_ID}`);
    console.log(`   🔐 AUTHORIZATION_NEEDED: ${process.env.AUTHORIZATION_NEEDED}`);
    console.log(`   🌐 BROWSER_OPEN: ${process.env.BROWSER_OPEN}`);
    console.log(`   🔌 CHROME_CDP_ENDPOINT: ${process.env.CHROME_CDP_ENDPOINT}`);
    
    // Извлекаем данные для тестируемых полей
    const { surname, middleAndGivenName, dateOfBirthType, sex, hasOtherPassports } = userData.personalInformation;
    const { type: passportType } = userData.passportInformation;
    const { occupation } = userData.occupation;
    
    // === ТЕСТИРУЕМ ПОЛЯ PERSONAL INFORMATION ===
    
    // Заполняем и проверяем поле surname (1.1)
    await applicationFormTestPage.aFillSurnameField(surname);
    const isSurnameCorrect = await applicationFormTestPage.aVerifySurnameField(surname);

    // Заполняем и проверяем поле middleAndGivenName (1.2)
    await applicationFormTestPage.aFillMiddleAndGivenNameField(middleAndGivenName);
    const isNameCorrect = await applicationFormTestPage.aVerifyMiddleAndGivenNameField(middleAndGivenName);

    // Заполняем и проверяем поле dateOfBirthType (1.3)
    await applicationFormTestPage.aFillDateOfBirthTypeField(dateOfBirthType);
    const isDateTypeCorrect = await applicationFormTestPage.aVerifyDateOfBirthTypeField(dateOfBirthType);

    // Заполняем и проверяем поле sex (1.5)
    await applicationFormTestPage.aFillSexField(sex);
    const isSexCorrect = await applicationFormTestPage.aVerifySexField(sex);

    // Заполняем и проверяем поле hasOtherPassports (1.13)
    await applicationFormTestPage.aFillHasOtherPassportsField(hasOtherPassports);
    const isHasOtherPassportsCorrect = await applicationFormTestPage.aVerifyHasOtherPassportsField(hasOtherPassports);
    
    // === ТЕСТИРУЕМ ПОЛЯ PASSPORT INFORMATION ===
    
    // Заполняем и проверяем поле passport type (3.3)
    await applicationFormTestPage.aFillPassportTypeField(passportType);
    const isPassportTypeCorrect = await applicationFormTestPage.aVerifyPassportTypeField(passportType);
    
    // === ТЕСТИРУЕМ ПОЛЯ OCCUPATION ===
    
    // Заполняем и проверяем поле occupation (5.1)
    await applicationFormTestPage.aFillOccupationField(occupation);
    const isOccupationCorrect = await applicationFormTestPage.aVerifyOccupationField(occupation);
    
    // Проверяем результаты
    expect(isSurnameCorrect).toBe(true);
    expect(isNameCorrect).toBe(true);
    expect(isDateTypeCorrect).toBe(true);
    expect(isSexCorrect).toBe(true);
    expect(isHasOtherPassportsCorrect).toBe(true);
    expect(isPassportTypeCorrect).toBe(true);
    expect(isOccupationCorrect).toBe(true);
    
    console.log('✅ Тест полей Personal Information (1.1, 1.2, 1.3, 1.5, 1.13), Passport Information (3.3) и Occupation (5.1) завершен успешно!');
  });
}); 