import { Page, Locator, expect } from '@playwright/test';
import { getUserIdFromEnv } from '../utils/envConfig';

export interface UserSelection {
  userId: string;
  userDataPath: string;
}

export class ApplicationFormPage {
  readonly page: Page;
  
  // Селекторы для основных разделов формы
  readonly ePersonalInformationSection: Locator;
  readonly ePassportInformationSection: Locator;
  readonly eContactInformationSection: Locator;
  readonly eOccupationSection: Locator;
  readonly eTripInformationSection: Locator;
  
  // Селекторы для кнопок формы
  readonly eSaveButton: Locator;
  readonly eSubmitButton: Locator;
  readonly eNextStepButton: Locator;
  
  // Селекторы для загрузки файлов
  readonly ePhotoUploadField: Locator;
  readonly ePassportUploadField: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Основные разделы формы
    this.ePersonalInformationSection = page.locator('h3:has-text("PERSONAL INFORMATION")');
    this.ePassportInformationSection = page.locator('h3:has-text("PASSPORT INFORMATION")');
    this.eContactInformationSection = page.locator('h3:has-text("CONTACT INFORMATION")');
    this.eOccupationSection = page.locator('h3:has-text("OCCUPATION")');
    this.eTripInformationSection = page.locator('h3:has-text("TRIP INFORMATION")');
    
    // Кнопки формы
    this.eSaveButton = page.getByRole('button', { name: 'Save' });
    this.eSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.eNextStepButton = page.getByRole('button', { name: 'Next Step' });
    
    // Поля загрузки файлов
    this.ePhotoUploadField = page.locator('input[type="file"]').first();
    this.ePassportUploadField = page.locator('input[type="file"]').last();
  }

  /**
   * Проверяем, что находимся на странице формы заявления
   */
  async aCheckApplicationFormPage() {
    console.log('📄 Проверяем страницу формы заявления...');
    
    // Проверяем URL
    await expect(this.page).toHaveURL(/.*e-visa\/foreigners/, { timeout: 20000 });
    
    // Проверяем заголовок
    await expect(this.page).toHaveTitle(/e-Visa Foreigners/, { timeout: 20000 });
    
    // Проверяем наличие основных разделов формы
    await expect(this.ePersonalInformationSection).toBeVisible({ timeout: 20000 });
    
    console.log('✅ Успешно попали на страницу формы заявления на визу');
    console.log('📝 Форма готова для заполнения данными пользователя');
  }

  /**
   * Выбираем пользователя для заполнения данных
   * По умолчанию использует USER_ID из .env файла
   */
  aSelectUser(userId?: string): UserSelection {
    // Если userId не передан, берём из .env файла
    const selectedUserId = userId || getUserIdFromEnv();
    
    console.log(`👤 Выбираем пользователя ${selectedUserId} для заполнения данных`);
    if (!userId) {
      console.log(`   🔧 Пользователь взят из .env файла (USER_ID=${selectedUserId})`);
    }
    
    const userSelection: UserSelection = {
      userId: selectedUserId,
      userDataPath: `files/${selectedUserId}/${selectedUserId}.json`
    };
    
    console.log(`📁 Путь к данным: ${userSelection.userDataPath}`);
    console.log(`✅ Пользователь ${selectedUserId} выбран`);
    
    return userSelection;
  }

  /**
   * Автоматически выбираем пользователя из .env конфигурации
   */
  aSelectUserFromConfig(): UserSelection {
    console.log('⚙️ Автоматический выбор пользователя из .env конфигурации...');
    return this.aSelectUser(); // Вызываем без параметров, чтобы взять из .env
  }

  /**
   * Проверяем видимость всех основных разделов формы
   */
  async aCheckAllFormSections() {
    console.log('📋 Проверяем все разделы формы...');
    
    await expect(this.ePersonalInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "PERSONAL INFORMATION" виден');
    
    await expect(this.ePassportInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "PASSPORT INFORMATION" виден');
    
    await expect(this.eContactInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "CONTACT INFORMATION" виден');
    
    await expect(this.eOccupationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "OCCUPATION" виден');
    
    await expect(this.eTripInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "TRIP INFORMATION" виден');
    
    console.log('✅ Все основные разделы формы найдены');
  }

  /**
   * Сохраняем черновик формы
   */
  async aSaveForm() {
    console.log('💾 Сохраняем форму...');
    
    try {
      await this.eSaveButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      console.log('✅ Форма сохранена');
    } catch (error) {
      console.log('⚠️ Кнопка Save не найдена или недоступна');
    }
  }

  /**
   * Отправляем заполненную форму
   */
  async aSubmitForm() {
    console.log('📤 Отправляем форму...');
    
    try {
      await this.eSubmitButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      console.log('✅ Форма отправлена');
    } catch (error) {
      console.log('⚠️ Кнопка Submit не найдена или недоступна');
    }
  }

  /**
   * Переходим к следующему шагу
   */
  async aClickNextStep() {
    console.log('➡️ Переходим к следующему шагу...');
    
    try {
      await this.eNextStepButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      console.log('✅ Переход к следующему шагу выполнен');
    } catch (error) {
      console.log('⚠️ Кнопка Next Step не найдена или недоступна');
    }
  }

  /**
   * Загружаем фотографию
   */
  async aUploadPhoto(photoPath: string) {
    console.log('📸 Загружаем фотографию...');
    
    try {
      await this.ePhotoUploadField.setInputFiles(photoPath);
      console.log(`✅ Фотография загружена: ${photoPath}`);
    } catch (error) {
      console.log(`⚠️ Ошибка загрузки фотографии: ${error}`);
    }
  }

  /**
   * Загружаем скан паспорта
   */
  async aUploadPassport(passportPath: string) {
    console.log('📄 Загружаем скан паспорта...');
    
    try {
      await this.ePassportUploadField.setInputFiles(passportPath);
      console.log(`✅ Скан паспорта загружен: ${passportPath}`);
    } catch (error) {
      console.log(`⚠️ Ошибка загрузки паспорта: ${error}`);
    }
  }

  /**
   * Скроллим к определённому разделу формы
   */
  async aScrollToSection(sectionName: string) {
    console.log(`🔄 Скроллим к разделу: ${sectionName}`);
    
    let targetSection: Locator;
    
    switch (sectionName.toLowerCase()) {
      case 'personal':
      case 'personal information':
        targetSection = this.ePersonalInformationSection;
        break;
      case 'passport':
      case 'passport information':
        targetSection = this.ePassportInformationSection;
        break;
      case 'contact':
      case 'contact information':
        targetSection = this.eContactInformationSection;
        break;
      case 'occupation':
        targetSection = this.eOccupationSection;
        break;
      case 'trip':
      case 'trip information':
        targetSection = this.eTripInformationSection;
        break;
      default:
        console.log(`⚠️ Неизвестный раздел: ${sectionName}`);
        return;
    }
    
    await targetSection.scrollIntoViewIfNeeded();
    console.log(`✅ Прокрутили к разделу: ${sectionName}`);
  }

  /**
   * Делаем скриншот текущего состояния формы
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
   * Проверяем готовность формы к заполнению
   */
  async aVerifyFormReady() {
    console.log('🔍 Проверяем готовность формы к заполнению...');
    
    await this.aCheckApplicationFormPage();
    await this.aCheckAllFormSections();
    
    console.log('✅ Форма готова к заполнению данными');
  }
} 