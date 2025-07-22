import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { MainPage, LoginPage, ApplicationFormPage, LoginData } from '../pages';
import { connectAndGetPage, checkChromeAvailability, isAuthorizationNeeded, isBrowserOpenMode, logCurrentConfig } from '../utils';

test.describe('🚀 Vietnam E-Visa - Автоматический флоу (.env управление)', () => {
  let loginData: LoginData;
  let mainPage: MainPage;
  let loginPage: LoginPage;
  let applicationFormPage: ApplicationFormPage;

  test.beforeEach(async ({ page: playwrightPage }) => {
    // Показываем конфигурацию из .env
    console.log('🔧 Загружаем конфигурацию из .env файла...');
    logCurrentConfig();
    
    let page;
    
    // Проверяем режим работы браузера
    if (isBrowserOpenMode()) {
      console.log('🔗 Режим: подключение к существующему Chrome...');
      
      // Проверяем доступность Chrome для подключения
      const isChromeAvailable = await checkChromeAvailability(9222);
      
      if (!isChromeAvailable) {
        console.log('❌ Chrome недоступен для подключения!');
        console.log('💡 Запустите Chrome командой: npm run chrome:debug');
        console.log('💡 Или измените BROWSER_OPEN=false в .env для использования нового браузера');
        throw new Error('Chrome не запущен с отладочным портом 9222. Запустите: npm run chrome:debug');
      }
      
      // Подключаемся к существующему Chrome
      const { browser, page: connectedPage } = await connectAndGetPage(9222);
      page = connectedPage;
      console.log('✅ Подключение к существующему Chrome выполнено');
    } else {
      console.log('🆕 Режим: запуск нового браузера...');
      page = playwrightPage;
      console.log('✅ Новый браузер запущен');
    }
    
    // Создаём все три Page Object класса
    mainPage = new MainPage(page);
    loginPage = new LoginPage(page);
    applicationFormPage = new ApplicationFormPage(page);
    
    // Автоматически выбираем пользователя из .env
    const userSelection = applicationFormPage.aSelectUserFromConfig();
    
    // Загружаем данные пользователя для авторизации
    const userDataPath = path.join(process.cwd(), userSelection.userDataPath);
    const rawData = readFileSync(userDataPath, 'utf-8');
    const userData = JSON.parse(rawData);
    
    // Извлекаем данные для авторизации
    loginData = {
      email: userData.login || userData.personalInformation?.email || 'lindon0390@gmail.com',
      password: userData.password || userData.loginCredentials?.password || 'Timur123!'
    };
    
    console.log(`📧 Email для авторизации: ${loginData.email}`);
  });

  test('🚀 Автоматический флоу (управляется через .env)', async () => {
    test.setTimeout(600000); // 10 минут

    console.log('🚀 Начинаем автоматический флоу на основе .env конфигурации...');
    
    const authNeeded = isAuthorizationNeeded();
    console.log(`🔐 Авторизация: ${authNeeded ? 'требуется' : 'пропускается'}`);

    // ЭТАП 1: Главная страница
    console.log('\n🌐 ЭТАП 1: Главная страница');
    await mainPage.aGoToMainPage();

    if (authNeeded) {
      // ЭТАП 2: Авторизация (если требуется)
      console.log('\n🔐 ЭТАП 2: Авторизация');
      await mainPage.aClickLoginButton();
      await loginPage.aCompleteLogin(loginData);
      await loginPage.aVerifyLoginSuccess();
      await mainPage.aCheckAuthorizationSuccess();
    } else {
      console.log('\n⏭️ ЭТАП 2: Авторизация пропущена согласно .env настройкам');
    }

    // ЭТАП 3: Переход к форме заявления
    console.log('\n📋 ЭТАП 3: Переход к форме заявления');
    await mainPage.aNavigateToApplicationForm();

    // ЭТАП 4: Проверка формы заявления
    console.log('\n📄 ЭТАП 4: Проверка формы заявления');
    await applicationFormPage.aVerifyFormReady();
    
    const selectedUser = applicationFormPage.aSelectUserFromConfig();
    
    // Делаем финальный скриншот формы заявления
    await applicationFormPage.aTakeScreenshot('env-auto-flow-ready');
    
    console.log('\n🎉 Автоматический флоу завершён!');
    console.log(`👤 Выбран пользователь: ${selectedUser.userId} (из .env)`);
    
    if (isBrowserOpenMode()) {
      console.log('🔗 Браузер остается открытым для дальнейшей работы');
    } else {
      console.log('🆕 Новый браузер использован согласно .env настройкам');
    }
  });

  test.skip('Только авторизация (управляется через .env)', async () => {
    console.log('🔐 Тестируем авторизацию согласно .env настройкам...');
    
    const authNeeded = isAuthorizationNeeded();
    
    // ЭТАП 1: Главная страница
    await mainPage.aGoToMainPage();

    if (authNeeded) {
      // ЭТАП 2: Авторизация
      await mainPage.aClickLoginButton();
      await loginPage.aCompleteLogin(loginData);
      await loginPage.aVerifyLoginSuccess();
      await mainPage.aCheckAuthorizationSuccess();
      
      await mainPage.aTakeScreenshot('env-authorized-main-page');
      console.log('✅ Авторизация завершена успешно!');
    } else {
      console.log('⏭️ Авторизация пропущена согласно AUTHORIZATION_NEEDED=false');
      await mainPage.aTakeScreenshot('env-no-auth-main-page');
    }
  });

  test.skip('Только переход к форме (без авторизации)', async () => {
    console.log('📋 Тестируем только переход к форме заявления...');
    console.log('⚠️ ВНИМАНИЕ: Предполагается, что авторизация не требуется или уже выполнена');
    
    // ЭТАП 1: Открываем главную страницу
    await mainPage.aGoToMainPage();
    
    // ЭТАП 2: Переход к форме
    await mainPage.aNavigateToApplicationForm();
    
    // ЭТАП 3: Проверка и подготовка формы
    await applicationFormPage.aVerifyFormReady();
    
    const selectedUser = applicationFormPage.aSelectUserFromConfig();
    
    await applicationFormPage.aTakeScreenshot('env-form-ready');
    
    console.log('📝 Форма готова к заполнению!');
    console.log(`👤 Выбран пользователь: ${selectedUser.userId} (из .env)`);
  });

}); 