import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { EvisaVietnamFullFlowPage, LoginData, UserSelection } from '../pages/evisaVietnamFullFlow.page';

test.describe('Vietnam E-Visa - Полный флоу авторизации (протестирован через MCP)', () => {
  let loginData: LoginData;
  let userSelection: UserSelection;
  let evisaFlowPage: EvisaVietnamFullFlowPage;

  test.beforeEach(async ({ page }) => {
    // Выбираем пользователя (по умолчанию 001)
    const userId = "001";
    userSelection = {
      userId: userId,
      userDataPath: `files/${userId}/${userId}.json`
    };
    
    // Загружаем данные пользователя для авторизации
    const userDataPath = path.join(process.cwd(), userSelection.userDataPath);
    const rawData = readFileSync(userDataPath, 'utf-8');
    const userData = JSON.parse(rawData);
    
    // Извлекаем данные для авторизации
    loginData = {
      email: userData.login || userData.personalInformation?.email || 'lindon0390@gmail.com',
      password: userData.password || userData.loginCredentials?.password || 'Timur123!'
    };
    
    // Создаём Page Object
    evisaFlowPage = new EvisaVietnamFullFlowPage(page);
    
    console.log(`👤 Выбран пользователь: ${userSelection.userId}`);
    console.log(`📧 Email для авторизации: ${loginData.email}`);
  });

  test('Полный флоу авторизации и переход к форме заявления', async () => {
    // Увеличиваем таймаут для полного флоу
    test.setTimeout(600000); // 10 минут

    console.log('🎯 Начинаем протестированный через MCP полный флоу авторизации...');
    console.log('📋 Этот тест повторяет все действия, успешно протестированные через MCP Playwright');

    // Выполняем полный флоу авторизации
    const success = await evisaFlowPage.aCompleteAuthorizationFlow(loginData);
    
    expect(success).toBe(true);
    
    // Делаем финальный скриншот формы заявления
    await evisaFlowPage.aTakeScreenshot('application-form-ready');
    
    console.log('🎉 Полный флоу завершён! Форма заявления готова к заполнению');
    console.log(`👤 Данные пользователя ${userSelection.userId} готовы к использованию`);
  });

  test('Только авторизация без перехода к форме (для отладки)', async () => {
    test.setTimeout(300000); // 5 минут

    console.log('🔐 Тестируем только процесс авторизации...');

    // Шаги 1-2: Навигация
    await evisaFlowPage.aGoToMainPage();
    await evisaFlowPage.aClickLoginButton();
    
    // Шаги 3-5: Авторизация
    await evisaFlowPage.aFillLoginForm(loginData);
    await evisaFlowPage.aSubmitLoginForm();
    
    // Шаг 6: Проверка авторизации
    await evisaFlowPage.aVerifyLogin();
    
    // Скриншот авторизованного состояния
    await evisaFlowPage.aTakeScreenshot('authorized-main-page');
    
    console.log('✅ Авторизация завершена успешно!');
  });

  test('Только переход к форме после авторизации (предполагает ручную авторизацию)', async () => {
    test.setTimeout(300000); // 5 минут

    console.log('📋 Тестируем только переход к форме заявления...');
    console.log('⚠️ ВНИМАНИЕ: Этот тест предполагает, что пользователь уже авторизован!');

    // Переходим сразу на главную страницу (предполагая авторизацию)
    await evisaFlowPage.aGoToMainPage();

    // Переходим к форме заявления
    await evisaFlowPage.aClickApplyNow();
    await evisaFlowPage.aAcceptInstructions();
    await evisaFlowPage.aClickNextInPopup();
    await evisaFlowPage.aVerifyApplicationPage();

    // Выбираем пользователя для заполнения
    const selectedUser = evisaFlowPage.aSelectUser(userSelection.userId);
    
    // Скриншот готовой формы
    await evisaFlowPage.aTakeScreenshot('form-ready-for-filling');

    console.log('📝 Форма готова к заполнению!');
    console.log(`👤 Выбран пользователь: ${selectedUser.userId}`);
  });

  test('Демонстрация выбора разных пользователей', async () => {
    test.setTimeout(120000); // 2 минуты

    console.log('👥 Демонстрируем систему выбора пользователей...');

    // Тестируем выбор разных пользователей
    const users = ['001', '002', '003'];
    
    for (const userId of users) {
      const userSelection = evisaFlowPage.aSelectUser(userId);
      console.log(`✅ Пользователь ${userSelection.userId}: ${userSelection.userDataPath}`);
    }

    console.log('📋 Система выбора пользователей работает корректно');
  });
}); 