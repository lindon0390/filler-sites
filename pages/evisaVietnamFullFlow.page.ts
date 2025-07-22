import { Page, Locator, expect } from '@playwright/test';

export interface LoginData {
  email: string;
  password: string;
}

export interface UserSelection {
  userId: string; // например "001"
  userDataPath: string; // например "files/001/001.json"
}

export class EvisaVietnamFullFlowPage {
  readonly page: Page;
  
  // Селекторы для главной страницы
  readonly eLoginButton: Locator;
  readonly eApplyNowButton: Locator;
  
  // Селекторы для страницы логина
  readonly eAccountField: Locator;
  readonly ePasswordField: Locator;
  readonly eCaptchaField: Locator;
  readonly eLoginFormButton: Locator;
  
  // Селекторы для попапа инструкций
  readonly eComplianceCheckbox: Locator;
  readonly eInstructionsCheckbox: Locator;
  readonly eNextButton: Locator;
  
  // Селекторы для проверки авторизации
  readonly eUserProfileIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Главная страница
    this.eLoginButton = page.getByRole('button', { name: 'Login' });
    this.eApplyNowButton = page.getByRole('button', { name: 'Apply now' });
    
    // Страница логина
    this.eAccountField = page.getByRole('textbox', { name: 'Account *' });
    this.ePasswordField = page.getByRole('textbox', { name: 'Password *' });
    this.eCaptchaField = page.getByRole('textbox', { name: 'Captcha' });
    this.eLoginFormButton = page.locator('form').getByRole('button', { name: 'Login' });
    
    // Попап инструкций
    this.eComplianceCheckbox = page.getByRole('checkbox', { name: 'Confirm compliance with' });
    this.eInstructionsCheckbox = page.getByRole('checkbox', { name: 'Confirmation of reading' });
    this.eNextButton = page.getByRole('button', { name: 'Next' });
    
    // Проверка авторизации (проверяем, что кнопка Login исчезла)
    this.eUserProfileIcon = page.locator('.user-icon, .account-info, text=Profile');
  }

  /**
   * Шаг 1: Открываем главную страницу
   */
  async aGoToMainPage() {
    console.log('🌐 Шаг 1: Открываем главную страницу Vietnam E-Visa...');
    
    await this.page.goto('https://evisa.gov.vn/', { timeout: 20000 });
    
    // Ждём полной загрузки страницы
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    await expect(this.page).toHaveTitle(/Vietnam/, { timeout: 20000 });
    
    console.log('✅ Главная страница успешно загружена');
  }

  /**
   * Шаг 2: Кликаем на кнопку Login в хедере
   */
  async aClickLoginButton() {
    console.log('🔐 Шаг 2: Кликаем на кнопку Login в хедере...');
    
    await this.eLoginButton.click();
    
    // Ждём полной загрузки страницы логина
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    // Проверяем, что попали на страницу логина
    await expect(this.page).toHaveURL(/.*login/, { timeout: 20000 });
    await expect(this.page).toHaveTitle(/Login/, { timeout: 20000 });
    
    console.log('✅ Перешли на страницу логина');
  }

  /**
   * Шаги 3-4: Вводим логин и пароль, ждём ввода капчи пользователем
   */
  async aFillLoginForm(loginData: LoginData) {
    console.log('📝 Шаги 3-4: Заполняем форму авторизации...');
    
    // Ждём загрузки формы входа
    await this.eAccountField.waitFor({ timeout: 20000 });
    
    // Заполляем логин и пароль
    await this.eAccountField.fill(loginData.email);
    await this.ePasswordField.fill(loginData.password);
    
    // Ждём появления капчи
    await this.eCaptchaField.waitFor({ timeout: 20000 });
    
    console.log('📧 Email введён:', loginData.email);
    console.log('🔑 Пароль введён');
    console.log('⚠️ ВНИМАНИЕ: Пожалуйста, введите капчу вручную в браузере!');
    console.log('🎯 После ввода капчи нажмите кнопку "Resume" в Playwright Inspector');
    console.log('   или закройте это окно, если оно появилось');
    
    // Пауза для ручного ввода капчи
    await this.page.pause();
    
    console.log('✅ Капча введена, продолжаем...');
  }

  /**
   * Альтернативный метод: Вводим логин и пароль, ждём заполнения капчи по времени
   */
  async aFillLoginFormWithTimeout(loginData: LoginData, timeoutSeconds: number = 60) {
    console.log('📝 Шаги 3-4: Заполняем форму авторизации (с таймаутом)...');
    
    // Ждём загрузки формы входа
    await this.eAccountField.waitFor({ timeout: 20000 });
    
    // Заполняем логин и пароль
    await this.eAccountField.fill(loginData.email);
    await this.ePasswordField.fill(loginData.password);
    
    // Ждём появления капчи
    await this.eCaptchaField.waitFor({ timeout: 20000 });
    
    console.log('📧 Email введён:', loginData.email);
    console.log('🔑 Пароль введён');
    console.log('⚠️ ВНИМАНИЕ: Пожалуйста, введите капчу вручную в браузере!');
    console.log(`⏰ У вас есть ${timeoutSeconds} секунд для ввода капчи...`);
    
    // Ждём заполнения поля капчи или таймаута
    console.log('🕐 Ожидаем заполнения поля капчи...');
    
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1000;
    
    while (Date.now() - startTime < timeoutMs) {
      const captchaValue = await this.eCaptchaField.inputValue();
      if (captchaValue && captchaValue.length >= 4) {
        console.log('✅ Капча введена, продолжаем...');
        return;
      }
      
      // Показываем оставшееся время каждые 5 секунд
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000));
      
      if (elapsed % 5000 < 1000) { // Примерно каждые 5 секунд
        console.log(`⏳ Осталось времени: ${remaining} секунд...`);
      }
      
      await this.page.waitForTimeout(1000); // Проверяем каждую секунду
    }
    
    console.log('⚠️ Время ожидания истекло, продолжаем с текущим значением капчи...');
  }

  /**
   * Шаг 5: Нажимаем кнопку Login в форме авторизации
   */
  async aSubmitLoginForm() {
    console.log('🚀 Шаг 5: Нажимаем кнопку Login для входа...');
    
    await this.eLoginFormButton.click();
    
    // Ждём полной загрузки после логина
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    console.log('✅ Форма авторизации отправлена');
  }

  /**
   * Шаг 6: Проверяем успешную авторизацию
   */
  async aVerifyLogin() {
    console.log('🔍 Шаг 6: Проверяем успешную авторизацию...');
    
    // Проверяем, что вернулись на главную страницу
    await expect(this.page).toHaveURL('https://evisa.gov.vn/', { timeout: 20000 });
    
    // Проверяем, что кнопка Login исчезла из хедера (заменилась на профиль пользователя)
    try {
      await expect(this.eLoginButton).toBeHidden({ timeout: 10000 });
      console.log('✅ Кнопка Login исчезла из хедера - авторизация успешна');
    } catch {
      console.log('⚠️ Кнопка Login всё ещё видна, но продолжаем...');
    }
    
    console.log('✅ Авторизация прошла успешно');
  }

  /**
   * Шаг 7: Нажимаем кнопку Apply now
   */
  async aClickApplyNow() {
    console.log('📋 Шаг 7: Нажимаем кнопку Apply now...');
    
    await this.eApplyNowButton.click();
    
    // Ждём загрузки попапа
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    console.log('✅ Кнопка Apply now нажата, ждём попап с инструкциями');
  }

  /**
   * Шаг 8: Ставим галочки в два чекбокса в попапе
   */
  async aAcceptInstructions() {
    console.log('☑️ Шаг 8: Ставим галочки в чекбоксы попапа...');
    
    // Ждём появления чекбоксов
    await this.eComplianceCheckbox.waitFor({ timeout: 20000 });
    await this.eInstructionsCheckbox.waitFor({ timeout: 20000 });
    
    // Ставим галочки
    await this.eComplianceCheckbox.check();
    await this.eInstructionsCheckbox.check();
    
    console.log('✅ Первый чекбокс: Согласие с вьетнамскими законами');
    console.log('✅ Второй чекбокс: Подтверждение прочтения инструкций');
  }

  /**
   * Шаг 9: Нажимаем кнопку Next в попапе
   */
  async aClickNextInPopup() {
    console.log('➡️ Шаг 9: Нажимаем кнопку Next в попапе...');
    
    // Проверяем, что кнопка Next стала активной
    await expect(this.eNextButton).toBeEnabled({ timeout: 20000 });
    
    await this.eNextButton.click();
    
    // Ждём полной загрузки формы заявления
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    console.log('✅ Попап закрыт, переходим к форме заявления');
  }

  /**
   * Шаг 10: Проверяем, что попали на страницу формы заявления
   */
  async aVerifyApplicationPage() {
    console.log('📄 Шаг 10: Проверяем страницу формы заявления...');
    
    // Проверяем URL
    await expect(this.page).toHaveURL(/.*e-visa\/foreigners/, { timeout: 20000 });
    
    // Проверяем заголовок
    await expect(this.page).toHaveTitle(/e-Visa Foreigners/, { timeout: 20000 });
    
    // Проверяем наличие формы заявления
    await expect(this.page.locator('h3:has-text("PERSONAL INFORMATION")')).toBeVisible({ timeout: 20000 });
    
    console.log('✅ Успешно попали на страницу формы заявления на визу');
    console.log('📝 Форма готова для заполнения данными пользователя');
  }

  /**
   * Полный флоу авторизации и перехода к форме заявления
   */
  async aCompleteAuthorizationFlow(loginData: LoginData) {
    console.log('🎯 Начинаем полный флоу авторизации Vietnam E-Visa...');
    console.log('📊 Пользователь:', loginData.email);
    
    try {
      // Шаги 1-2: Навигация
      await this.aGoToMainPage();
      await this.aClickLoginButton();
      
      // Шаги 3-5: Авторизация
      await this.aFillLoginForm(loginData);
      await this.aSubmitLoginForm();
      
      // Шаг 6: Проверка авторизации
      await this.aVerifyLogin();
      
      // Шаги 7-9: Переход к форме заявления
      await this.aClickApplyNow();
      await this.aAcceptInstructions();
      await this.aClickNextInPopup();
      
      // Шаг 10: Проверка формы заявления
      await this.aVerifyApplicationPage();
      
      console.log('🎉 Полный флоу авторизации завершён успешно!');
      console.log('📋 Можно приступать к заполнению формы заявления');
      
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка в процессе авторизации:', error);
      throw error;
    }
  }

  /**
   * Полный флоу авторизации с таймаутом для капчи (без pause)
   */
  async aCompleteAuthorizationFlowWithTimeout(loginData: LoginData, captchaTimeoutSeconds: number = 60) {
    console.log('🎯 Начинаем полный флоу авторизации Vietnam E-Visa (с таймаутом)...');
    console.log('📊 Пользователь:', loginData.email);
    console.log(`⏰ Таймаут капчи: ${captchaTimeoutSeconds} секунд`);
    
    try {
      // Шаги 1-2: Навигация
      await this.aGoToMainPage();
      await this.aClickLoginButton();
      
      // Шаги 3-5: Авторизация с таймаутом
      await this.aFillLoginFormWithTimeout(loginData, captchaTimeoutSeconds);
      await this.aSubmitLoginForm();
      
      // Шаг 6: Проверка авторизации
      await this.aVerifyLogin();
      
      // Шаги 7-9: Переход к форме заявления
      await this.aClickApplyNow();
      await this.aAcceptInstructions();
      await this.aClickNextInPopup();
      
      // Шаг 10: Проверка формы заявления
      await this.aVerifyApplicationPage();
      
      console.log('🎉 Полный флоу авторизации завершён успешно!');
      console.log('📋 Можно приступать к заполнению формы заявления');
      
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка в процессе авторизации:', error);
      throw error;
    }
  }

  /**
   * Вспомогательный метод: Делаем скриншот текущего состояния
   */
  async aTakeScreenshot(filename: string) {
    const timestamp = Date.now();
    const fullFilename = `test-results/${filename}-${timestamp}.png`;
    
    await this.page.screenshot({ 
      path: fullFilename, 
      fullPage: true 
    });
    
    console.log(`📸 Скриншот сохранён: ${fullFilename}`);
  }

  /**
   * Вспомогательный метод: Выбор пользователя для заполнения данных
   */
  aSelectUser(userId: string = "001"): UserSelection {
    console.log(`👤 Шаг 10: Выбираем пользователя ${userId} для заполнения данных`);
    
    const userSelection: UserSelection = {
      userId: userId,
      userDataPath: `files/${userId}/${userId}.json`
    };
    
    console.log(`📁 Путь к данным: ${userSelection.userDataPath}`);
    console.log(`✅ Пользователь ${userId} выбран по умолчанию`);
    
    return userSelection;
  }
} 