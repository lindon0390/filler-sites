import { test, expect } from '@playwright/test';
import { PersonalInformationTestPage } from '../pages/personalInformationTestPage.page';
import { connectAndGetActivePage } from '../utils/browserConnect';
import { getEnvConfig } from '../utils/envConfig';

test.describe('🔧 Отладка полей Personal Information', () => {
  let page: any;
  let personalInfoTestPage: PersonalInformationTestPage;
  
  test.beforeAll(async () => {
    // Подключаемся к существующему Chrome
    const { page: connectedPage } = await connectAndGetActivePage();
    page = connectedPage;
    
    // Создаем POM для тестирования полей
    personalInfoTestPage = new PersonalInformationTestPage(page);
  });
  
  test('📝 Тест заполнения полей 1.1, 1.2 и 1.3', async () => {
    // Проверяем, что подключились к правильной странице
    await personalInfoTestPage.aCheckEvisaPage();
    
    // Загружаем данные пользователя
    const config = getEnvConfig();
    const userId = config.userId;
    const userDataPath = `files/${userId}/${userId}.json`;
    
    // Читаем данные из JSON файла
    const fs = require('fs');
    const path = require('path');
    const userDataContent = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    const surname = userDataContent.personalInformation.surname;
    const middleAndGivenName = userDataContent.personalInformation.middleAndGivenName;
    const dateOfBirthType = userDataContent.personalInformation.dateOfBirthType;
    
    // Заполняем и проверяем поле surname (1.1)
    await personalInfoTestPage.aFillSurnameField(surname);
    const isSurnameCorrect = await personalInfoTestPage.aVerifySurnameField(surname);
    
    // Заполняем и проверяем поле middleAndGivenName (1.2)
    await personalInfoTestPage.aFillMiddleAndGivenNameField(middleAndGivenName);
    const isNameCorrect = await personalInfoTestPage.aVerifyMiddleAndGivenNameField(middleAndGivenName);
    
    // Заполняем и проверяем поле dateOfBirthType (1.3)
    await personalInfoTestPage.aFillDateOfBirthTypeField(dateOfBirthType);
    const isDateTypeCorrect = await personalInfoTestPage.aVerifyDateOfBirthTypeField(dateOfBirthType);
    
    // Утверждения
    expect(isSurnameCorrect).toBe(true);
    expect(isNameCorrect).toBe(true);
    expect(isDateTypeCorrect).toBe(true);
    
    console.log('✅ Тест полей 1.1, 1.2 и 1.3 завершен успешно!');
  });
  
  test.afterAll(async () => {
    console.log('🏁 Завершение отладки полей Personal Information');
  });
}); 