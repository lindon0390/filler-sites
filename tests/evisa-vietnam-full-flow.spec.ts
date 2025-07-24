import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { MainPage, LoginPage, ApplicationFormPage, LoginData } from '../pages';
import { connectAndGetActivePage, checkChromeAvailability, isAuthorizationNeeded, isBrowserOpenMode, logCurrentConfig } from '../utils';

test.describe('🚀 Vietnam E-Visa - Автоматический флоу (.env управление)', () => {
  let loginData: LoginData;
  let mainPage: MainPage;
  let loginPage: LoginPage;
  let applicationFormPage: ApplicationFormPage;

  test.beforeEach(async ({ page: playwrightPage, browser: playwrightBrowser }) => {
    // Показываем конфигурацию из .env
    console.log('🔧 Загружаем конфигурацию из .env файла...');
    logCurrentConfig();
    
    let page;
    
    // Проверяем режим работы браузера
    if (isBrowserOpenMode()) {
      console.log('🔗 Режим: подключение к существующему Chrome...');
      console.log('⚠️ Игнорируем браузер Playwright и подключаемся к существующему Chrome');
      
      // Закрываем браузер Playwright если он был создан
      try {
        await playwrightBrowser.close();
        console.log('🚫 Браузер Playwright закрыт');
      } catch (error) {
        console.log('ℹ️ Браузер Playwright уже закрыт или не был создан');
      }
      
      // Проверяем доступность Chrome для подключения
      const isChromeAvailable = await checkChromeAvailability(9222);
      
      if (!isChromeAvailable) {
        console.log('❌ Chrome недоступен для подключения!');
        console.log('💡 Запустите Chrome командой: npm run chrome:debug');
        console.log('💡 Или измените BROWSER_OPEN=false в .env для использования нового браузера');
        throw new Error('Chrome не запущен с отладочным портом 9222. Запустите: npm run chrome:debug');
      }
      
      // Подключаемся к существующему Chrome
      const { browser, page: connectedPage } = await connectAndGetActivePage(9222);
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

  test.skip('🚀 Автоматический флоу (управляется через .env)', async () => {
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

  test.skip('🤖 Автозаполнение формы анкеты', async () => {
    // Используем уже подключенный applicationFormPage из beforeEach
    console.log('🚀 Начинаем автозаполнение формы Vietnam E-Visa...');
    
    // Получаем информацию о выбранном пользователе
    const userSelection = applicationFormPage.aSelectUserFromConfig();
    
    // Загружаем данные пользователя
    const userDataPath = path.join(process.cwd(), userSelection.userDataPath);
    const rawData = readFileSync(userDataPath, 'utf-8');
    const userData = JSON.parse(rawData);
    
    console.log('🚀 Начинаем автозаполнение формы Vietnam E-Visa...');
    console.log(`👤 Пользователь: ${userSelection.userId}`);
    console.log(`📁 Данные из: ${userDataPath}`);
    
    // ЭТАП 1: Проверяем, что мы на странице формы
    console.log('\n📄 ЭТАП 1: Проверка страницы формы');
    await applicationFormPage.aVerifyFormReady();
    
    // ЭТАП 2: Автозаполнение всех разделов формы
    console.log('\n🤖 ЭТАП 2: Автозаполнение формы');
    await applicationFormPage.aFillCompleteForm(userData);
    
    // ЭТАП 3: Проверяем что кнопка Next стала активной
    console.log('\n✅ ЭТАП 3: Финальная проверка');
    
    // Ждём активации кнопки Next
    await expect(applicationFormPage.eNextStepButton).toBeEnabled({ timeout: 10000 });
    console.log('✅ Кнопка "Next" активна - форма готова к отправке');
    
    // Делаем финальный скриншот
    await applicationFormPage.aTakeScreenshot('form-filled-complete');
    
    console.log('🎉 Автозаполнение формы завершено успешно!');
    console.log('📋 Все поля заполнены данными пользователя');
    console.log('🔄 Форма готова к переходу на следующий этап');
    
    // ЭТАП 4: Переходим к следующему шагу (опционально)
    console.log('\n➡️ ЭТАП 4: Переход к следующему шагу');
    await applicationFormPage.aClickNextStep();
    
    console.log('🏁 Тест автозаполнения формы завершён!');
  });

  test.skip('🔧 Технический тест: подключение к Chrome CDP и поиск локатора', async ({ page: playwrightPage }) => {
    console.log('🔧 Запуск технического теста подключения к Chrome CDP...');
    
    // Показываем конфигурацию
    logCurrentConfig();
    
    // Проверяем что Chrome запущен
    console.log('🔍 Проверяем доступность Chrome на порту 9222...');
    const isChromeAvailable = await checkChromeAvailability(9222);
    
    if (!isChromeAvailable) {
      console.log('❌ Chrome недоступен для подключения!');
      console.log('💡 Запустите Chrome командой: npm run chrome:debug');
      throw new Error('Chrome не запущен с отладочным портом 9222');
    }
    
    console.log('✅ Chrome доступен для подключения');
    
    // Подключаемся ТОЛЬКО к уже открытой странице с анкетой E-Visa
    console.log('🔗 Подключаемся ТОЛЬКО к уже открытой странице с анкетой...');
    const { browser, page } = await connectAndGetActivePage(9222);
    
    console.log(`📄 Подключились к странице: ${await page.title()}`);
    console.log(`🔗 URL страницы: ${page.url()}`);
    
    // Строго проверяем что это E-Visa страница (НЕ ОТКРЫВАЕМ НОВУЮ!)
    if (!page.url().includes('evisa.gov.vn')) {
      console.log('❌ Подключились к неправильной странице!');
      console.log('💡 Убедитесь что вкладка с E-Visa анкетой открыта и активна в Chrome');
      throw new Error(`Ожидается страница E-Visa, получена: ${page.url()}`);
    }
    
    console.log('✅ Подключились к правильной вкладке с E-Visa');
    console.log('🚫 НЕ СОЗДАЕМ новые страницы - работаем только с уже открытой!');
    
    // Создаем Page Object для проверки локаторов
    const applicationFormPage = new ApplicationFormPage(page);
    
    // Пытаемся сразу найти локатор (без переходов по попапам)
    console.log('🔍 Ищем локатор Surname (Last name) на ТЕКУЩЕЙ странице...');
    
    try {
      // Сначала проверяем текущее состояние страницы
      const currentTitle = await page.title();
      const currentUrl = page.url();
      console.log(`📋 Текущее состояние страницы:`);
      console.log(`   📄 Заголовок: ${currentTitle}`);
      console.log(`   🔗 URL: ${currentUrl}`);
      
      // Ждем появления поля Surname (увеличиваем timeout)
      await applicationFormPage.eSurnameField.waitFor({ 
        state: 'visible', 
        timeout: 20000 
      });
      
      console.log('✅ Локатор Surname (Last name) найден и видим!');
      
      // Проверяем что поле доступно для ввода
      const isEnabled = await applicationFormPage.eSurnameField.isEnabled();
      expect(isEnabled).toBe(true);
      console.log('✅ Поле Surname доступно для ввода');
      
      // Получаем placeholder текст для дополнительной проверки
      const placeholder = await applicationFormPage.eSurnameField.getAttribute('placeholder');
      console.log(`📝 Placeholder поля: "${placeholder}"`);
      expect(placeholder).toContain('surname');
      
      console.log('🎉 Технический тест ПРОЙДЕН! Подключение к существующей странице работает!');
      
    } catch (error) {
      console.error('❌ Ошибка при поиске локатора Surname на существующей странице:', error);
      
      // Делаем скриншот текущего состояния
      await page.screenshot({ 
        path: 'screenshots/debug-existing-page.png',
        fullPage: true 
      });
      console.log('📸 Скриншот текущей страницы сохранен в screenshots/debug-existing-page.png');
      
      // Показываем подробную информацию о состоянии страницы
      try {
        const allElements = await page.$$('input, select, textarea, button');
        console.log(`🔍 Найдено интерактивных элементов на странице: ${allElements.length}`);
        
        for (let i = 0; i < Math.min(allElements.length, 10); i++) {
          const element = allElements[i];
          const tagName = await element.evaluate(el => el.tagName);
          const placeholder = await element.getAttribute('placeholder') || '';
          const id = await element.getAttribute('id') || '';
          const className = await element.getAttribute('class') || '';
          console.log(`   ${i+1}. ${tagName} placeholder="${placeholder}" id="${id}" class="${className.substring(0, 50)}"`);
        }
      } catch (debugError) {
        console.log('⚠️ Не удалось получить информацию об элементах страницы');
      }
      
      throw error;
    }
    
    // НЕ закрываем подключение - оставляем страницу открытой
    console.log('✅ Тест завершен, страница остается открытой для дальнейшей работы');
  });

}); 