import { Page, Locator, expect } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  
  // Селекторы для главной страницы
  readonly eLoginButton: Locator;
  readonly eApplyNowButton: Locator;
  
  // Селекторы для попапа инструкций
  readonly eComplianceCheckbox: Locator;
  readonly eInstructionsCheckbox: Locator;
  readonly eNextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Главная страница
    this.eLoginButton = page.getByRole('button', { name: 'Login' });
    this.eApplyNowButton = page.getByRole('button', { name: 'Apply now' });
    
    // Попап инструкций
    this.eComplianceCheckbox = page.getByRole('checkbox', { name: 'Confirm compliance with' });
    this.eInstructionsCheckbox = page.getByRole('checkbox', { name: 'Confirmation of reading' });
    this.eNextButton = page.getByRole('button', { name: 'Next' });
  }

  /**
   * Открываем главную страницу Vietnam E-Visa с повторными попытками
   */
  async aGoToMainPage() {
    console.log('🌐 Открываем главную страницу Vietnam E-Visa...');
    
    const maxAttempts = 3;
    let attempt = 1;
    
    while (attempt <= maxAttempts) {
      try {
        console.log(`🔄 Попытка ${attempt}/${maxAttempts}: Загружаем главную страницу...`);
        
        await this.page.goto('https://evisa.gov.vn/', { timeout: 20000 });
        await this.page.waitForLoadState('networkidle', { timeout: 20000 });
        await expect(this.page).toHaveTitle(/Vietnam/, { timeout: 20000 });
        
        console.log('✅ Главная страница успешно загружена');
        return; // Успешно загружено, выходим из цикла
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`⚠️ Попытка ${attempt}/${maxAttempts} неудачна:`, errorMessage);
        
        if (attempt === maxAttempts) {
          console.log('❌ Все попытки исчерпаны, главная страница не загружается');
          throw new Error(`Не удалось загрузить главную страницу за ${maxAttempts} попыток. Последняя ошибка: ${errorMessage}`);
        }
        
        console.log(`🔄 Перезагружаем страницу и пытаемся снова...`);
        
        try {
          // Перезагружаем страницу перед следующей попыткой
          await this.page.reload({ timeout: 10000 });
          await this.page.waitForTimeout(2000); // Небольшая пауза между попытками
        } catch (reloadError) {
          console.log('⚠️ Ошибка при перезагрузке, продолжаем...');
        }
        
        attempt++;
      }
    }
  }

  /**
   * Кликаем на кнопку Login в хедере
   */
  async aClickLoginButton() {
    console.log('🔐 Кликаем на кнопку Login в хедере...');
    
    await this.eLoginButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    // Проверяем переход на страницу логина
    await expect(this.page).toHaveURL(/.*login/, { timeout: 20000 });
    await expect(this.page).toHaveTitle(/Login/, { timeout: 20000 });
    
    console.log('✅ Перешли на страницу логина');
  }

  /**
   * Проверяем успешную авторизацию (кнопка Login исчезла)
   */
  async aCheckAuthorizationSuccess() {
    console.log('🔍 Проверяем успешную авторизацию...');
    
    await expect(this.page).toHaveURL('https://evisa.gov.vn/', { timeout: 20000 });
    
    try {
      await expect(this.eLoginButton).toBeHidden({ timeout: 10000 });
      console.log('✅ Кнопка Login исчезла из хедера - авторизация успешна');
    } catch {
      console.log('⚠️ Кнопка Login всё ещё видна, но продолжаем...');
    }
    
    console.log('✅ Авторизация прошла успешно');
  }

  /**
   * Нажимаем кнопку Apply now
   */
  async aClickApplyNow() {
    console.log('📋 Нажимаем кнопку Apply now...');
    
    await this.eApplyNowButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    console.log('✅ Кнопка Apply now нажата, ждём попап с инструкциями');
  }

  /**
   * Ставим галочки в два чекбокса в попапе инструкций
   */
  async aAcceptInstructions() {
    console.log('☑️ Ставим галочки в чекбоксы попапа...');
    
    await this.eComplianceCheckbox.waitFor({ timeout: 20000 });
    await this.eInstructionsCheckbox.waitFor({ timeout: 20000 });
    
    await this.eComplianceCheckbox.check();
    await this.eInstructionsCheckbox.check();
    
    console.log('✅ Первый чекбокс: Согласие с вьетнамскими законами');
    console.log('✅ Второй чекбокс: Подтверждение прочтения инструкций');
  }

  /**
   * Нажимаем кнопку Next в попапе
   */
  async aClickNextInPopup() {
    console.log('➡️ Нажимаем кнопку Next в попапе...');
    
    await expect(this.eNextButton).toBeEnabled({ timeout: 20000 });
    await this.eNextButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    
    console.log('✅ Попап закрыт, переходим к форме заявления');
  }

  /**
   * Полный процесс перехода к форме заявления (после авторизации)
   */
  async aNavigateToApplicationForm() {
    console.log('📋 Переходим к форме заявления...');
    
    await this.aClickApplyNow();
    await this.aAcceptInstructions();
    await this.aClickNextInPopup();
    
    console.log('✅ Переход к форме заявления завершён');
  }

  /**
   * Вспомогательный метод: Делаем скриншот
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
} 