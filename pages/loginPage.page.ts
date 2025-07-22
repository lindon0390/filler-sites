import { Page, Locator, expect } from '@playwright/test';

export interface LoginData {
  email: string;
  password: string;
}

export class LoginPage {
  readonly page: Page;
  
  // Селекторы для страницы логина
  readonly eAccountField: Locator;
  readonly ePasswordField: Locator;
  readonly eCaptchaField: Locator;
  readonly eLoginFormButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Страница логина
    this.eAccountField = page.getByRole('textbox', { name: 'Account *' });
    this.ePasswordField = page.getByRole('textbox', { name: 'Password *' });
    this.eCaptchaField = page.getByRole('textbox', { name: 'Captcha' });
    this.eLoginFormButton = page.locator('form').getByRole('button', { name: 'Login' });
  }

  /**
   * Проверяем, что находимся на странице логина
   */
  async aCheckLoginPage() {
    console.log('📋 Проверяем страницу логина...');
    
    await expect(this.page).toHaveURL(/.*login/, { timeout: 20000 });
    await expect(this.page).toHaveTitle(/Login/, { timeout: 20000 });
    await expect(this.eAccountField).toBeVisible({ timeout: 20000 });
    
    console.log('✅ Находимся на странице логина');
  }

  /**
   * Заполняем форму логина и ждём ввода 6-значной капчи (30 секунд)
   */
  async aFillLoginForm(loginData: LoginData) {
    console.log('📝 Заполняем форму авторизации...');
    
    // Ждём загрузки формы входа
    await this.eAccountField.waitFor({ timeout: 20000 });
    
    // Заполняем логин и пароль
    await this.eAccountField.fill(loginData.email);
    await this.ePasswordField.fill(loginData.password);
    
    // Ждём появления капчи
    await this.eCaptchaField.waitFor({ timeout: 20000 });
    
    console.log('📧 Email введён:', loginData.email);
    console.log('🔑 Пароль введён');
    console.log('🔢 КАПЧА: Введите 6-значное число в браузере!');
    console.log('⏰ У вас есть 30 секунд для ввода капчи...');
    
    // Ждём ввода 6-значной капчи в течение 30 секунд
    const startTime = Date.now();
    const timeoutMs = 30 * 1000; // 30 секунд
    
    while (Date.now() - startTime < timeoutMs) {
      const captchaValue = await this.eCaptchaField.inputValue();
      
      // Проверяем, что введено ровно 6 цифр
      if (captchaValue && /^\d{6}$/.test(captchaValue)) {
        console.log(`✅ Капча введена: ${captchaValue} (6 цифр)`);
        return;
      }
      
      // Показываем оставшееся время каждые 5 секунд
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((timeoutMs - elapsed) / 1000));
      
      if (elapsed % 5000 < 1000) { // Примерно каждые 5 секунд
        console.log(`⏳ Ожидаем 6-значную капчу... Осталось: ${remaining} секунд`);
        if (captchaValue) {
          console.log(`   Текущее значение: "${captchaValue}" (длина: ${captchaValue.length})`);
        }
      }
      
      await this.page.waitForTimeout(1000); // Проверяем каждую секунду
    }
    
    // Если время вышло - проверяем финальное значение и падаем с ошибкой
    const finalCaptchaValue = await this.eCaptchaField.inputValue();
    console.log(`❌ Время ожидания капчи истекло (30 секунд)`);
    console.log(`   Финальное значение: "${finalCaptchaValue}"`);
    console.log(`   Требуется: 6-значное число`);
    
    throw new Error(`Капча не введена за 30 секунд. Получено: "${finalCaptchaValue}", требуется: 6-значное число`);
  }

  /**
   * Отправляем форму логина
   */
  async aSubmitLoginForm() {
    console.log('🚀 Отправляем форму авторизации...');
    
    await this.eLoginFormButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    console.log('✅ Форма авторизации отправлена');
  }

  /**
   * Полная авторизация с вводом 6-значной капчи (30 секунд)
   */
  async aCompleteLogin(loginData: LoginData) {
    console.log('🔐 Начинаем процесс авторизации...');
    console.log('📊 Пользователь:', loginData.email);
    console.log('🔢 Ожидаем ввод 6-значной капчи в течение 30 секунд');
    
    try {
      await this.aCheckLoginPage();
      await this.aFillLoginForm(loginData);
      await this.aSubmitLoginForm();
      
      console.log('✅ Авторизация завершена');
      return true;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Ошибка в процессе авторизации:', errorMessage);
      throw error;
    }
  }

  /**
   * Проверяем успешность авторизации по URL
   */
  async aVerifyLoginSuccess() {
    console.log('🔍 Проверяем успешность авторизации...');
    
    // Проверяем, что вернулись на главную страницу
    await expect(this.page).toHaveURL('https://evisa.gov.vn/', { timeout: 20000 });
    
    console.log('✅ Авторизация прошла успешно - вернулись на главную страницу');
  }
} 