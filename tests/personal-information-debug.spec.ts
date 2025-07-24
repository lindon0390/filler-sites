import { test, expect } from '@playwright/test';
import { PersonalInformationTestPage } from '../pages/personalInformationTestPage.page';
import { connectAndGetActivePage } from '../utils/browserConnect';
import { getEnvConfig } from '../utils/envConfig';
import * as fs from 'fs';
import * as path from 'path';

test.describe('🔧 Отладка полей Personal Information', () => {
  test('📝 Тест заполнения полей 1.1, 1.2, 1.3, 1.5 и 1.13', async () => {
    // Подключаемся к существующему Chrome
    const { page } = await connectAndGetActivePage();
    
    // Проверяем, что мы на правильной странице
    const pageTitle = await page.title();
    console.log(`✅ Подключились к странице: "${pageTitle}"`);
    
    // Создаём экземпляр POM
    const personalInfoTestPage = new PersonalInformationTestPage(page);
    
    // Проверяем страницу E-Visa
    await personalInfoTestPage.aCheckEvisaPage();
    
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
    const { surname, middleAndGivenName, dateOfBirthType, hasOtherPassports } = userData.personalInformation;
    
    // Заполняем и проверяем поле surname (1.1)
    await personalInfoTestPage.aFillSurnameField(surname);
    const isSurnameCorrect = await personalInfoTestPage.aVerifySurnameField(surname);

    // Заполняем и проверяем поле middleAndGivenName (1.2)
    await personalInfoTestPage.aFillMiddleAndGivenNameField(middleAndGivenName);
    const isNameCorrect = await personalInfoTestPage.aVerifyMiddleAndGivenNameField(middleAndGivenName);

    // Заполняем и проверяем поле dateOfBirthType (1.3)
    await personalInfoTestPage.aFillDateOfBirthTypeField(dateOfBirthType);
    const isDateTypeCorrect = await personalInfoTestPage.aVerifyDateOfBirthTypeField(dateOfBirthType);

    // Заполняем и проверяем поле hasOtherPassports (1.13)
    await personalInfoTestPage.aFillHasOtherPassportsField(hasOtherPassports);
    const isHasOtherPassportsCorrect = await personalInfoTestPage.aVerifyHasOtherPassportsField(hasOtherPassports);
    
    // Проверяем результаты
    expect(isSurnameCorrect).toBe(true);
    expect(isNameCorrect).toBe(true);
    expect(isDateTypeCorrect).toBe(true);
    expect(isHasOtherPassportsCorrect).toBe(true);
    
    console.log('✅ Тест полей 1.1, 1.2, 1.3, 1.5 и 1.13 завершен успешно!');
  });
}); 