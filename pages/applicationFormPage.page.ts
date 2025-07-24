import { Page, Locator, expect } from '@playwright/test';
import { getUserIdFromEnv } from '../utils/envConfig';

// Интерфейс для записи лога заполнения
export interface FormFillLogEntry {
  section: string;
  fieldName: string;
  fieldLabel: string;
  expectedValue: string;
  actualValue: string;
  status: 'success' | 'error' | 'skipped' | 'already_filled';
  timestamp: string;
  errorMessage?: string;
}

export interface FormFillLog {
  userId: string;
  testStartTime: string;
  testEndTime?: string;
  totalFields: number;
  successfulFields: number;
  errorFields: number;
  skippedFields: number;
  entries: FormFillLogEntry[];
}

export interface UserSelection {
  userId: string;
  userDataPath: string;
}

export class ApplicationFormPage {
  readonly page: Page;
  
  // Система логирования
  private formFillLog: FormFillLog;
  
  // Селекторы для основных разделов формы
  readonly ePersonalInformationSection: Locator;
  readonly eRequestedInformationSection: Locator;
  readonly ePassportInformationSection: Locator;
  readonly eContactInformationSection: Locator;
  readonly eOccupationSection: Locator;
  readonly eTripInformationSection: Locator;
  readonly eChildrenSection: Locator;
  readonly eExpensesSection: Locator;
  readonly eImagesSection: Locator;
  
  // Селекторы для кнопок формы
  readonly eNextStepButton: Locator;
  readonly eCancelButton: Locator;
  
  // ИЗОБРАЖЕНИЯ
  readonly ePortraitPhotoUpload: Locator;
  readonly ePassportPhotoUpload: Locator;
  
  // 1. PERSONAL INFORMATION - АКТУАЛЬНЫЕ ЛОКАТОРЫ
  readonly eSurnameField: Locator;
  readonly eMiddleAndGivenNameField: Locator;
  readonly eDateOfBirthField: Locator;
  readonly eDateOfBirthFullRadio: Locator;
  readonly eDateOfBirthYearOnlyRadio: Locator;
  readonly eSexSelect: Locator;
  readonly eNationalitySelect: Locator;
  readonly eIdentityCardField: Locator;
  readonly eEmailField: Locator;
  readonly eAgreeCreateAccountCheckbox: Locator;
  readonly eReligionField: Locator;
  readonly ePlaceOfBirthField: Locator;
  readonly eReEnterEmailField: Locator;
  
  // Radio buttons for Yes/No questions - ОБНОВЛЕНЫ
  readonly eOtherPassportsYes: Locator;
  readonly eOtherPassportsNo: Locator;
  readonly eMultipleNationalitiesYes: Locator;
  readonly eMultipleNationalitiesNo: Locator;
  readonly eViolationOfLawsYes: Locator;
  readonly eViolationOfLawsNo: Locator;
  
  // 2. REQUESTED INFORMATION - ОБНОВЛЕНЫ
  readonly eSingleEntryRadio: Locator;
  readonly eMultipleEntryRadio: Locator;
  readonly eValidFromField: Locator;
  readonly eValidToField: Locator;
  
  // 3. PASSPORT INFORMATION - ОБНОВЛЕНЫ
  readonly ePassportNumberField: Locator;
  readonly eIssuingAuthorityField: Locator;
  readonly ePassportTypeSelect: Locator;
  readonly ePassportDateOfIssueField: Locator;
  readonly ePassportExpiryDateField: Locator;
  readonly eHoldOtherPassportsYes: Locator;
  readonly eHoldOtherPassportsNo: Locator;
  
  // 4. CONTACT INFORMATION - ОБНОВЛЕНЫ
  readonly ePermanentAddressField: Locator;
  readonly eContactAddressField: Locator;
  readonly eTelephoneNumberField: Locator;
  readonly eEmergencyContactNameField: Locator;
  readonly eEmergencyContactAddressField: Locator;
  readonly eEmergencyContactPhoneField: Locator;
  readonly eEmergencyContactRelationshipField: Locator;
  
  // 5. OCCUPATION - ОБНОВЛЕНЫ
  readonly eOccupationSelect: Locator;
  readonly eOccupationInfoField: Locator;
  readonly eCompanyNameField: Locator;
  readonly ePositionField: Locator;
  readonly eCompanyAddressField: Locator;
  readonly eCompanyPhoneField: Locator;
  
  // 6. TRIP INFORMATION - ОБНОВЛЕНЫ
  readonly ePurposeOfEntrySelect: Locator;
  readonly eIntendedDateOfEntryField: Locator;
  readonly eIntendedLengthOfStayField: Locator;
  readonly ePhoneInVietnamField: Locator;
  readonly eResidentialAddressSelect: Locator;
  readonly eProvinceSelect: Locator;
  readonly eWardSelect: Locator;
  readonly eBorderGateEntrySelect: Locator;
  readonly eBorderGateExitSelect: Locator;
  readonly eTempResidenceCheckbox: Locator;
  
  // Trip questions - ОБНОВЛЕНЫ
  readonly eAgencyContactYes: Locator;
  readonly eAgencyContactNo: Locator;
  readonly eBeenToVietnamYes: Locator;
  readonly eBeenToVietnamNo: Locator;
  readonly eHasRelativesYes: Locator;
  readonly eHasRelativesNo: Locator;
  
  // 8. TRIP EXPENSES & INSURANCE - ОБНОВЛЕНЫ
  readonly eIntendedExpensesField: Locator;
  readonly eInsuranceSelect: Locator;
  readonly eExpensesCoveredBySelect: Locator;
  
  // Final declaration checkbox - ОБНОВЛЕН
  readonly eDeclarationCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Инициализация системы логирования
    this.formFillLog = {
      userId: '',
      testStartTime: new Date().toISOString(),
      totalFields: 0,
      successfulFields: 0,
      errorFields: 0,
      skippedFields: 0,
      entries: []
    };
    
    // Основные разделы формы с правильными заголовками
    this.eImagesSection = page.locator('h3:has-text("Foreigner\'s images")');
    this.ePersonalInformationSection = page.locator('h3:has-text("1. PERSONAL INFORMATION")');
    this.eRequestedInformationSection = page.locator('h3:has-text("2. REQUESTED INFORMATION")');
    this.ePassportInformationSection = page.locator('h3:has-text("3. PASSPORT INFORMATION")');
    this.eContactInformationSection = page.locator('h3:has-text("4. CONTACT INFORMATION")');
    this.eOccupationSection = page.locator('h3:has-text("5. OCCUPATION")');
    this.eTripInformationSection = page.locator('h3:has-text("6. INFORMATION ABOUT THE TRIP")');
    this.eChildrenSection = page.locator('h3').filter({ hasText: /7\. Accompany child/ });
    this.eExpensesSection = page.locator('h3').filter({ hasText: /8\.\s*TRIP/ });
    
    // Кнопки формы
    this.eCancelButton = page.getByRole('button', { name: 'Cancel' });
    this.eNextStepButton = page.getByRole('button', { name: 'Next' });
    
    // ИЗОБРАЖЕНИЯ - правильные локаторы для загрузки файлов
    this.ePortraitPhotoUpload = page.locator('input[type="file"]').first();
    this.ePassportPhotoUpload = page.locator('input[type="file"]').last();
    
    // 1. PERSONAL INFORMATION - АКТУАЛЬНЫЕ ЛОКАТОРЫ на основе реальной страницы
    this.eSurnameField = page.getByRole('textbox', { name: 'Surname (Last name)' });
    this.eMiddleAndGivenNameField = page.getByRole('textbox', { name: 'Middle and given name (First name) *' });
    this.eDateOfBirthField = page.locator('input[placeholder="DD/MM/YYYY"]').first();
    this.eDateOfBirthFullRadio = page.getByRole('radio', { name: 'Full' });
    this.eDateOfBirthYearOnlyRadio = page.getByRole('radio', { name: 'Only year is known' });
    this.eSexSelect = page.getByRole('combobox', { name: 'Sex *' });
    this.eNationalitySelect = page.getByRole('combobox', { name: 'Nationality *' });
    this.eIdentityCardField = page.getByRole('textbox', { name: 'Identity Card' });
    this.eEmailField = page.getByPlaceholder('Enter email', { exact: true });
    this.eAgreeCreateAccountCheckbox = page.getByRole('checkbox', { name: 'Agree to create account by email' });
    this.eReligionField = page.getByRole('textbox', { name: 'Religion *' });
    this.ePlaceOfBirthField = page.getByRole('textbox', { name: 'Place of birth *' });
    this.eReEnterEmailField = page.getByRole('textbox', { name: 'Re-enter Email *' });
    
    // Radio buttons for Yes/No questions - обновлены под реальную структуру
    this.eOtherPassportsYes = page.locator('text=Have you ever used any other passports to enter into Viet Nam?').locator('..').getByRole('radio', { name: 'Yes' });
    this.eOtherPassportsNo = page.locator('text=Have you ever used any other passports to enter into Viet Nam?').locator('..').getByRole('radio', { name: 'No' });
    this.eMultipleNationalitiesYes = page.locator('text=Do you have multiple nationalities?').locator('..').getByRole('radio', { name: 'Yes' });
    this.eMultipleNationalitiesNo = page.locator('text=Do you have multiple nationalities?').locator('..').getByRole('radio', { name: 'No' });
    this.eViolationOfLawsYes = page.locator('text=Violation of the Vietnamese laws/regulations').locator('..').getByRole('radio', { name: 'Yes' });
    this.eViolationOfLawsNo = page.locator('text=Violation of the Vietnamese laws/regulations').locator('..').getByRole('radio', { name: 'No' });
    
    // 2. REQUESTED INFORMATION - обновлены
    this.eSingleEntryRadio = page.getByRole('radio', { name: 'Single-entry' });
    this.eMultipleEntryRadio = page.getByRole('radio', { name: 'Multiple-entry' });
    this.eValidFromField = page.getByRole('textbox', { name: 'Grant e-Visa valid from *' });
    this.eValidToField = page.getByRole('textbox', { name: 'To *' });
    
    // 3. PASSPORT INFORMATION - обновлены
    this.ePassportNumberField = page.getByRole('textbox', { name: 'Passport *' });
    this.eIssuingAuthorityField = page.getByRole('textbox', { name: 'Issuing Authority/Place of issue' }).first();
    this.ePassportTypeSelect = page.getByRole('combobox', { name: 'Type *' });
    this.ePassportDateOfIssueField = page.getByRole('textbox', { name: 'Date of issue *' });
    this.ePassportExpiryDateField = page.getByRole('textbox', { name: 'Expiry date *' });
    this.eHoldOtherPassportsYes = page.locator('text=Do you hold any other valid passports').locator('..').getByRole('radio', { name: 'Yes' });
    this.eHoldOtherPassportsNo = page.locator('text=Do you hold any other valid passports').locator('..').getByRole('radio', { name: 'No' });
    
    // 4. CONTACT INFORMATION - обновлены
    this.ePermanentAddressField = page.getByRole('textbox', { name: /Permanent residential address.*different from the current residence/ });
    this.eContactAddressField = page.getByRole('textbox', { name: 'Contact address *' });
    this.eTelephoneNumberField = page.getByRole('textbox', { name: 'Telephone number *' }).first();
    this.eEmergencyContactNameField = page.getByRole('textbox', { name: 'Full name *' });
    this.eEmergencyContactAddressField = page.getByRole('textbox', { name: 'Current residential address *' });
    this.eEmergencyContactPhoneField = page.getByRole('textbox', { name: 'Telephone number *' }).nth(1);
    this.eEmergencyContactRelationshipField = page.getByRole('textbox', { name: 'Relationship *' });
    
    // 5. OCCUPATION - обновлены
    this.eOccupationSelect = page.getByRole('combobox', { name: 'Occupation' });
    this.eOccupationInfoField = page.getByRole('textbox', { name: 'Occupation Info' });
    this.eCompanyNameField = page.getByRole('textbox', { name: 'Name of Company/Agency/School' });
    this.ePositionField = page.getByRole('textbox', { name: 'Position/Course of study' });
    this.eCompanyAddressField = page.getByRole('textbox', { name: 'Address of Company/Agency/School' });
    this.eCompanyPhoneField = page.getByRole('textbox', { name: 'Company/agency/school phone number' });
    
    // 6. TRIP INFORMATION - обновлены
    this.ePurposeOfEntrySelect = page.getByRole('combobox', { name: 'Purpose of entry *' });
    this.eIntendedDateOfEntryField = page.getByRole('textbox', { name: 'Intended date of entry *' });
    this.eIntendedLengthOfStayField = page.getByRole('textbox', { name: 'Intended length of stay in Viet Nam *' });
    this.ePhoneInVietnamField = page.getByRole('textbox', { name: 'Phone number (in Viet Nam)' });
    this.eResidentialAddressSelect = page.getByRole('combobox', { name: 'Residential address in Viet Nam *' });
    this.eProvinceSelect = page.getByRole('combobox', { name: 'Province/city *' });
    this.eWardSelect = page.getByRole('combobox', { name: 'Ward / commune *' });
    this.eBorderGateEntrySelect = page.getByRole('combobox', { name: 'Intended border gate of entry *' });
    this.eBorderGateExitSelect = page.getByRole('combobox', { name: 'Intended border gate of exit *' });
    this.eTempResidenceCheckbox = page.getByRole('checkbox', { name: /Committed to declare temporary residence/ });
    
    // Trip questions - обновлены с правильными локаторами
    this.eAgencyContactYes = page.locator('text=Agency/Organization/Individual that the applicant plans to contact').locator('..').getByRole('radio', { name: 'Yes' });
    this.eAgencyContactNo = page.locator('text=Agency/Organization/Individual that the applicant plans to contact').locator('..').getByRole('radio', { name: 'No' });
    this.eBeenToVietnamYes = page.locator('text=Have you been to Viet Nam in the last 01 year?').locator('..').getByRole('radio', { name: 'Yes' });
    this.eBeenToVietnamNo = page.locator('text=Have you been to Viet Nam in the last 01 year?').locator('..').getByRole('radio', { name: 'No' });
    this.eHasRelativesYes = page.locator('text=Do you have relatives who currently reside in Viet Nam?').locator('..').getByRole('radio', { name: 'Yes' });
    this.eHasRelativesNo = page.locator('text=Do you have relatives who currently reside in Viet Nam?').locator('..').getByRole('radio', { name: 'No' });
    
    // 8. TRIP EXPENSES & INSURANCE - обновлены
    this.eIntendedExpensesField = page.getByRole('textbox', { name: 'Intended expenses (in USD)' });
    this.eInsuranceSelect = page.getByRole('combobox', { name: 'Did you buy insurance?' });
    this.eExpensesCoveredBySelect = page.getByRole('combobox', { name: 'Who will cover the trip\'s expenses of the applicant' });
    
    // Final declaration checkbox - обновлен
    this.eDeclarationCheckbox = page.getByRole('checkbox', { name: /I hereby declare that the above statements are true/ });
  }

  /**
   * Проверяем, что находимся на странице формы заявления
   */
  async aCheckApplicationFormPage() {
    console.log('📄 Проверяем страницу формы заявления...');
    
    // Проверяем URL
    await expect(this.page).toHaveURL(/.*e-visa\/foreigners/, { timeout: 20000 });
    
    // Проверяем заголовок
    await expect(this.page).toHaveTitle(/Vietnam National Electronic Visa system/, { timeout: 20000 });
    
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
    
    await expect(this.eImagesSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "Foreigner\'s images" виден');
    
    await expect(this.ePersonalInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "1. PERSONAL INFORMATION" виден');
    
    await expect(this.eRequestedInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "2. REQUESTED INFORMATION" виден');
    
    await expect(this.ePassportInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "3. PASSPORT INFORMATION" виден');
    
    await expect(this.eContactInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "4. CONTACT INFORMATION" виден');
    
    await expect(this.eOccupationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "5. OCCUPATION" виден');
    
    await expect(this.eTripInformationSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "6. INFORMATION ABOUT THE TRIP" виден');
    
    await expect(this.eChildrenSection).toBeVisible({ timeout: 10000 });
    console.log('✅ Раздел "7. ACCOMPANY CHILDREN (under 14)" виден');
    
    // Прокручиваем к разделу 8 и проверяем его видимость
    try {
      await this.eExpensesSection.scrollIntoViewIfNeeded();
      await expect(this.eExpensesSection).toBeVisible({ timeout: 10000 });
      console.log('✅ Раздел "8. TRIP\'S EXPENSES, INSURANCE" виден');
    } catch (error) {
      console.log('⚠️ Раздел 8 не найден, но продолжаем работу...');
    }
    
    console.log('✅ Все 9 разделов формы найдены (включая изображения)');
  }

  /**
   * Переходим к следующему шагу (кнопка Next)
   */
  async aClickNextStep() {
    console.log('➡️ Переходим к следующему шагу...');
    
    try {
      // Проверяем, что кнопка Next активна
      await expect(this.eNextStepButton).toBeEnabled({ timeout: 5000 });
      await this.eNextStepButton.click();
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      console.log('✅ Переход к следующему шагу выполнен');
    } catch (error) {
      console.log('⚠️ Кнопка Next не найдена или недоступна (возможно, не все обязательные поля заполнены)');
      throw error;
    }
  }

  /**
   * Загружаем фотографию
   */
  async aUploadPhoto(photoPath: string) {
    console.log('📸 Загружаем фотографию...');
    
    try {
      // Проверяем существование файла
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.resolve(photoPath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️ Файл не найден: ${fullPath}`);
        return;
      }
      
      console.log(`📁 Путь к файлу: ${fullPath}`);
      
      // Загружаем файл
      await this.ePortraitPhotoUpload.setInputFiles(fullPath);
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
      // Проверяем существование файла
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.resolve(passportPath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️ Файл не найден: ${fullPath}`);
        return;
      }
      
      console.log(`📁 Путь к файлу: ${fullPath}`);
      
      // Загружаем файл
      await this.ePassportPhotoUpload.setInputFiles(fullPath);
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
      case 'images':
      case 'foreigner images':
        targetSection = this.eImagesSection;
        break;
      case 'personal':
      case 'personal information':
      case '1':
        targetSection = this.ePersonalInformationSection;
        break;
      case 'requested':
      case 'requested information':
      case '2':
        targetSection = this.eRequestedInformationSection;
        break;
      case 'passport':
      case 'passport information':
      case '3':
        targetSection = this.ePassportInformationSection;
        break;
      case 'contact':
      case 'contact information':
      case '4':
        targetSection = this.eContactInformationSection;
        break;
      case 'occupation':
      case '5':
        targetSection = this.eOccupationSection;
        break;
      case 'trip':
      case 'trip information':
      case 'information about the trip':
      case '6':
        targetSection = this.eTripInformationSection;
        break;
      case 'children':
      case 'accompany children':
      case '7':
        targetSection = this.eChildrenSection;
        break;
      case 'expenses':
      case 'trip expenses':
      case 'insurance':
      case '8':
        targetSection = this.eExpensesSection;
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
    const fullFilename = `screenshots/${filename}-${timestamp}.png`;
    
    await this.page.screenshot({ 
      path: fullFilename, 
      fullPage: true 
    });
    
    console.log(`📸 Скриншот сохранён: ${fullFilename}`);
  }

  /**
   * Обрабатываем попап с инструкциями (если он есть)
   */
  async aHandleInstructionsPopup() {
    console.log('🔍 Проверяем наличие попапа с инструкциями...');
    
    try {
      // Проверяем наличие кнопки "Apply now"
      const applyButton = this.page.getByRole('button', { name: 'Apply now' });
      if (await applyButton.isVisible({ timeout: 5000 })) {
        console.log('📋 Найден попап инструкций, нажимаем "Apply now"');
        await applyButton.click();
        await this.page.waitForTimeout(3000);
        
        // Ставим галочки в чекбоксы
        const checkbox1 = this.page.getByRole('checkbox', { name: 'Confirm compliance with' });
        const checkbox2 = this.page.getByRole('checkbox', { name: 'Confirmation of reading' });
        
        if (await checkbox1.isVisible({ timeout: 5000 })) {
          console.log('✅ Ставим первую галочку');
          await checkbox1.click();
        }
        
        if (await checkbox2.isVisible({ timeout: 5000 })) {
          console.log('✅ Ставим вторую галочку');
          await checkbox2.click();
        }
        
        // Нажимаем Next
        const nextButton = this.page.getByRole('button', { name: 'Next' });
        if (await nextButton.isEnabled({ timeout: 5000 })) {
          console.log('➡️ Нажимаем "Next" для перехода к форме');
          await nextButton.click();
          await this.page.waitForTimeout(5000);
        }
      }
    } catch (error) {
      console.log('ℹ️ Попап инструкций не найден или уже пройден');
    }
  }

  /**
   * Проверяем готовность формы к заполнению
   */
  async aVerifyFormReady() {
    console.log('🔍 Проверяем готовность формы к заполнению...');
    
    // Сначала обрабатываем попап (если есть)
    await this.aHandleInstructionsPopup();
    
    // Затем проверяем форму
    await this.aCheckApplicationFormPage();
    await this.aCheckAllFormSections();
    
    console.log('✅ Форма готова к заполнению данными');
  }

  /**
   * АВТОЗАПОЛНЕНИЕ ФОРМЫ ПО ДАННЫМ ПОЛЬЗОВАТЕЛЯ
   */

  /**
   * Загружаем изображения (фото и паспорт)
   */
  async aUploadImages(userData: any) {
    console.log('📸 Загружаем изображения...');
    
    const images = userData.images;
    
    if (images?.portraitPhoto) {
      await this.aUploadPhoto(images.portraitPhoto);
      console.log(`✅ Портретное фото: ${images.portraitPhoto}`);
    } else {
      console.log('⚠️ Путь к портретному фото не указан в данных');
    }
    
    if (images?.passportDataPage) {
      await this.aUploadPassport(images.passportDataPage);
      console.log(`✅ Скан паспорта: ${images.passportDataPage}`);
    } else {
      console.log('⚠️ Путь к скану паспорта не указан в данных');
    }
    
    console.log('✅ Изображения загружены');
  }

  /**
   * Конфигурация полей согласно field-classification
   */
  private readonly fieldConfiguration = {
    // 0. Foreigner's images (изображения иностранца)
    'images.portraitPhoto': { type: undefined, section: 'Images' },
    'images.passportDataPage': { type: undefined, section: 'Images' },
    
    // 1. Personal Information (личная информация)
    'personalInformation.surname': { type: 1, section: 'Personal Information' },
    'personalInformation.middleAndGivenName': { type: 1, section: 'Personal Information' },
    'personalInformation.dateOfBirth': { type: 5, section: 'Personal Information' },
    'personalInformation.dateOfBirthType': { type: 6, section: 'Personal Information' },
    'personalInformation.sex': { type: 2, section: 'Personal Information' },
    'personalInformation.nationality': { type: 3, section: 'Personal Information' },
    'personalInformation.identityCard': { type: 1, section: 'Personal Information' },
    'personalInformation.email': { type: 1, section: 'Personal Information' },
    'personalInformation.agreeCreateAccount': { type: 7, section: 'Personal Information' },
    'personalInformation.religion': { type: 1, section: 'Personal Information' },
    'personalInformation.placeOfBirth': { type: 1, section: 'Personal Information' },
    'personalInformation.reEnterEmail': { type: 1, section: 'Personal Information' },
    'personalInformation.hasOtherPassports': { type: 6, section: 'Personal Information' },
    'personalInformation.hasMultipleNationalities': { type: 6, section: 'Personal Information' },
    'personalInformation.violationOfVietnameseLaws': { type: 6, section: 'Personal Information' },
    
    // 2. Requested Information (запрашиваемая информация)
    'requestedInformation.visaType': { type: 6, section: 'Requested Information' },
    'requestedInformation.validFrom': { type: 5, section: 'Requested Information' },
    'requestedInformation.validTo': { type: 5, section: 'Requested Information' },
    
    // 3. Passport Information (информация о паспорте)
    'passportInformation.passportNumber': { type: 1, section: 'Passport Information' },
    'passportInformation.issuingAuthority': { type: 1, section: 'Passport Information' },
    'passportInformation.type': { type: 3, section: 'Passport Information' },
    'passportInformation.dateOfIssue': { type: 5, section: 'Passport Information' },
    'passportInformation.expiryDate': { type: 5, section: 'Passport Information' },
    'passportInformation.holdOtherValidPassports': { type: 6, section: 'Passport Information' },
    
    // 4. Contact Information (контактная информация)
    'contactInformation.permanentResidentialAddress': { type: 1, section: 'Contact Information' },
    'contactInformation.contactAddress': { type: 1, section: 'Contact Information' },
    'contactInformation.telephoneNumber': { type: 1, section: 'Contact Information' },
    'contactInformation.emergencyContact.fullName': { type: 1, section: 'Contact Information' },
    'contactInformation.emergencyContact.currentResidentialAddress': { type: 1, section: 'Contact Information' },
    'contactInformation.emergencyContact.telephoneNumber': { type: 1, section: 'Contact Information' },
    'contactInformation.emergencyContact.relationship': { type: 2, section: 'Contact Information' },
    
    // 5. Occupation (занятость)
    'occupation.occupation': { type: 2, section: 'Occupation' },
    'occupation.occupationInfo': { type: 1, section: 'Occupation' },
    'occupation.nameOfCompanyAgencySchool': { type: 1, section: 'Occupation' },
    'occupation.positionCourseOfStudy': { type: 1, section: 'Occupation' },
    'occupation.addressOfCompanyAgencySchool': { type: 1, section: 'Occupation' },
    'occupation.companyAgencySchoolPhoneNumber': { type: 1, section: 'Occupation' },
    
    // 6. Trip Information (информация о поездке)
    'tripInformation.purposeOfEntry': { type: 3, section: 'Trip Information' },
    'tripInformation.intendedDateOfEntry': { type: 5, section: 'Trip Information' },
    'tripInformation.intendedLengthOfStay': { type: 1, section: 'Trip Information' },
    'tripInformation.phoneNumberInVietnam': { type: 1, section: 'Trip Information' },
    'tripInformation.residentialAddressInVietnam': { type: 1, section: 'Trip Information' },
    'tripInformation.provinceCity': { type: 3, section: 'Trip Information' },
    'tripInformation.wardCommune': { 
      type: 4, 
      section: 'Trip Information',
      dependsOn: 'tripInformation.provinceCity'
    },
    'tripInformation.intendedBorderGateOfEntry': { type: 3, section: 'Trip Information' },
    'tripInformation.intendedBorderGateOfExit': { type: 3, section: 'Trip Information' },
    'tripInformation.committedToDeclareTempResidence': { type: 7, section: 'Trip Information' },
    'tripInformation.hasAgencyOrganizationContact': { type: 6, section: 'Trip Information' },
    'tripInformation.beenToVietnamLastYear': { type: 6, section: 'Trip Information' },
    'tripInformation.hasRelativesInVietnam': { type: 6, section: 'Trip Information' },
    
    // 8. Trips Expenses Insurance (расходы на поездку и страхование)
    'tripsExpensesInsurance.intendedExpensesUSD': { type: 1, section: 'Trip Expenses' },
    'tripsExpensesInsurance.didBuyInsurance': { type: 2, section: 'Trip Expenses' },
    'tripsExpensesInsurance.specifyInsurance': { type: 1, section: 'Trip Expenses' },
    'tripsExpensesInsurance.whoCoversTripExpenses': { type: 2, section: 'Trip Expenses' },
    'tripsExpensesInsurance["Payment method"]': { type: 2, section: 'Trip Expenses' },
    
    // 9. Declaration (декларация)
    'declaration.agreed': { type: 7, section: 'Declaration' }
  };

  /**
   * Получение конфигурации поля
   */
  private getFieldConfig(fieldPath: string) {
    return (this.fieldConfiguration as any)[fieldPath] || { type: 1, section: 'Unknown' };
  }

  /**
   * Обновленный метод заполнения Personal Information с использованием единой системы
   */
  async aFillPersonalInformationIfNeeded(userData: any) {
    console.log('👤 Проверяем раздел "PERSONAL INFORMATION"...');
    const personal = userData.personalInformation;
    
    // Заполняем поля согласно их типам
    await this.aFillFieldByType(this.eSurnameField, personal.surname, 'personalInformation.surname', 'Personal Information', 1);
    // await this.aFillFieldByType(this.eMiddleAndGivenNameField, personal.middleAndGivenName, 'personalInformation.middleAndGivenName', 'Personal Information', 1);
    // await this.aFillFieldByType(this.eDateOfBirthField, personal.dateOfBirth, 'personalInformation.dateOfBirth', 'Personal Information', 5);
    
    // Радиокнопка для типа даты рождения
    // await this.aFillFieldByType(
    //   personal.dateOfBirthType === 'Full' ? this.eDateOfBirthFullRadio : this.eDateOfBirthYearOnlyRadio,
    //   personal.dateOfBirthType,
    //   'personalInformation.dateOfBirthType',
    //   'Personal Information',
    //   6
    // );
    
    // await this.aFillFieldByType(this.eSexSelect, personal.sex, 'personalInformation.sex', 'Personal Information', 2);
    // await this.aFillFieldByType(this.eNationalitySelect, personal.nationality, 'personalInformation.nationality', 'Personal Information', 3);
    // await this.aFillFieldByType(this.eIdentityCardField, personal.identityCard, 'personalInformation.identityCard', 'Personal Information', 1);
    // await this.aFillFieldByType(this.eEmailField, personal.email, 'personalInformation.email', 'Personal Information', 1);
    // await this.aFillFieldByType(this.eReEnterEmailField, personal.reEnterEmail, 'personalInformation.reEnterEmail', 'Personal Information', 1);
    // await this.aFillFieldByType(this.eReligionField, personal.religion, 'personalInformation.religion', 'Personal Information', 1);
    // await this.aFillFieldByType(this.ePlaceOfBirthField, personal.placeOfBirth, 'personalInformation.placeOfBirth', 'Personal Information', 1);
    
    // Чекбокс
    // await this.aFillFieldByType(this.eAgreeCreateAccountCheckbox, personal.agreeCreateAccount, 'personalInformation.agreeCreateAccount', 'Personal Information', 7);
    
    // Радиокнопки
    // await this.aFillFieldByType(
    //   personal.hasOtherPassports === 'Yes' ? this.eOtherPassportsYes : this.eOtherPassportsNo,
    //   personal.hasOtherPassports,
    //   'personalInformation.hasOtherPassports',
    //   'Personal Information',
    //   6,
    //   { yesRadio: this.eOtherPassportsYes, noRadio: this.eOtherPassportsNo }
    // );
    
    // await this.aFillFieldByType(
    //   personal.hasMultipleNationalities === 'Yes' ? this.eMultipleNationalitiesYes : this.eMultipleNationalitiesNo,
    //   personal.hasMultipleNationalities,
    //   'personalInformation.hasMultipleNationalities',
    //   'Personal Information',
    //   6,
    //   { yesRadio: this.eMultipleNationalitiesYes, noRadio: this.eMultipleNationalitiesNo }
    // );
    
    // await this.aFillFieldByType(
    //   personal.violationOfVietnameseLaws === 'Yes' ? this.eViolationOfLawsYes : this.eViolationOfLawsNo,
    //   personal.violationOfVietnameseLaws,
    //   'personalInformation.violationOfVietnameseLaws',
    //   'Personal Information',
    //   6,
    //   { yesRadio: this.eViolationOfLawsYes, noRadio: this.eViolationOfLawsNo }
    // );
  }

  /**
   * Заполняем раздел 2 - Requested Information
   */
  async aFillRequestedInformation(userData: any) {
    console.log('📝 Заполняем раздел "2. REQUESTED INFORMATION"...');
    
    const requested = userData.requestedInformation;
    
    // Тип визы
    if (requested.visaType === 'Single-entry') {
      await this.eSingleEntryRadio.click();
    } else {
      await this.eMultipleEntryRadio.click();
    }
    console.log(`✅ Тип визы: ${requested.visaType}`);
    
    // Даты - используем JavaScript для установки значений
    await this.eValidFromField.evaluate((el, value) => {
      if (el instanceof HTMLInputElement) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, requested.validFrom);
    console.log(`✅ Действительна с: ${requested.validFrom}`);
    
    await this.eValidToField.evaluate((el, value) => {
      if (el instanceof HTMLInputElement) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, requested.validTo);
    console.log(`✅ Действительна до: ${requested.validTo}`);
    
    console.log('✅ Раздел "2. REQUESTED INFORMATION" заполнен');
  }

  /**
   * Заполняем раздел 3 - Passport Information
   */
  async aFillPassportInformation(userData: any) {
    console.log('📝 Заполняем раздел "3. PASSPORT INFORMATION"...');
    
    const passport = userData.passportInformation;
    
    await this.ePassportNumberField.fill(passport.passportNumber);
    console.log(`✅ Номер паспорта: ${passport.passportNumber}`);
    
    await this.eIssuingAuthorityField.fill(passport.issuingAuthority);
    console.log(`✅ Орган выдачи: ${passport.issuingAuthority}`);
    
    // Тип паспорта
    await this.ePassportTypeSelect.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText(passport.type, { exact: true }).click();
    console.log(`✅ Тип паспорта: ${passport.type}`);
    
    // Даты - используем JavaScript
    await this.ePassportDateOfIssueField.evaluate((el, value) => {
      if (el instanceof HTMLInputElement) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, passport.dateOfIssue);
    console.log(`✅ Дата выдачи: ${passport.dateOfIssue}`);
    
    await this.ePassportExpiryDateField.evaluate((el, value) => {
      if (el instanceof HTMLInputElement) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, passport.expiryDate);
    console.log(`✅ Дата окончания: ${passport.expiryDate}`);
    
    // Наличие других паспортов
    if (passport.holdOtherValidPassports === 'Yes') {
      await this.eHoldOtherPassportsYes.click();
    } else {
      await this.eHoldOtherPassportsNo.click();
    }
    console.log(`✅ Другие действующие паспорта: ${passport.holdOtherValidPassports}`);
    
    console.log('✅ Раздел "3. PASSPORT INFORMATION" заполнен');
  }

  /**
   * Заполняем раздел 4 - Contact Information
   */
  async aFillContactInformation(userData: any) {
    console.log('📝 Заполняем раздел "4. CONTACT INFORMATION"...');
    
    const contact = userData.contactInformation;
    
    await this.ePermanentAddressField.fill(contact.permanentResidentialAddress);
    console.log(`✅ Постоянный адрес: ${contact.permanentResidentialAddress}`);
    
    await this.eContactAddressField.fill(contact.contactAddress);
    console.log(`✅ Контактный адрес: ${contact.contactAddress}`);
    
    await this.eTelephoneNumberField.fill(contact.telephoneNumber);
    console.log(`✅ Телефон: ${contact.telephoneNumber}`);
    
    // Emergency contact
    const emergency = contact.emergencyContact;
    await this.eEmergencyContactNameField.fill(emergency.fullName);
    console.log(`✅ Экстренный контакт - имя: ${emergency.fullName}`);
    
    await this.eEmergencyContactAddressField.fill(emergency.currentResidentialAddress);
    console.log(`✅ Экстренный контакт - адрес: ${emergency.currentResidentialAddress}`);
    
    await this.eEmergencyContactPhoneField.fill(emergency.telephoneNumber);
    console.log(`✅ Экстренный контакт - телефон: ${emergency.telephoneNumber}`);
    
    await this.eEmergencyContactRelationshipField.fill(emergency.relationship);
    console.log(`✅ Экстренный контакт - отношение: ${emergency.relationship}`);
    
    console.log('✅ Раздел "4. CONTACT INFORMATION" заполнен');
  }

  /**
   * Заполняем раздел 5 - Occupation
   */
  async aFillOccupation(userData: any) {
    console.log('📝 Заполняем раздел "5. OCCUPATION"...');
    
    const occupation = userData.occupation;
    
    // Профессия
    await this.eOccupationSelect.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText(occupation.occupation, { exact: true }).click();
    console.log(`✅ Профессия: ${occupation.occupation}`);
    
    await this.eOccupationInfoField.fill(occupation.occupationInfo);
    console.log(`✅ Информация о профессии: ${occupation.occupationInfo}`);
    
    await this.eCompanyNameField.fill(occupation.nameOfCompanyAgencySchool);
    console.log(`✅ Название компании: ${occupation.nameOfCompanyAgencySchool}`);
    
    await this.ePositionField.fill(occupation.positionCourseOfStudy);
    console.log(`✅ Должность: ${occupation.positionCourseOfStudy}`);
    
    await this.eCompanyAddressField.fill(occupation.addressOfCompanyAgencySchool);
    console.log(`✅ Адрес компании: ${occupation.addressOfCompanyAgencySchool}`);
    
    await this.eCompanyPhoneField.fill(occupation.companyAgencySchoolPhoneNumber);
    console.log(`✅ Телефон компании: ${occupation.companyAgencySchoolPhoneNumber}`);
    
    console.log('✅ Раздел "5. OCCUPATION" заполнен');
  }

  /**
   * Заполняем раздел 6 - Trip Information
   */
  async aFillTripInformation(userData: any) {
    console.log('📝 Заполняем раздел "6. INFORMATION ABOUT THE TRIP"...');
    
    const trip = userData.tripInformation;
    
    // Цель въезда
    await this.ePurposeOfEntrySelect.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText(trip.purposeOfEntry, { exact: true }).click();
    console.log(`✅ Цель въезда: ${trip.purposeOfEntry}`);
    
    // Дата въезда - JavaScript
    await this.eIntendedDateOfEntryField.evaluate((el, value) => {
      if (el instanceof HTMLInputElement) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, trip.intendedDateOfEntry);
    console.log(`✅ Планируемая дата въезда: ${trip.intendedDateOfEntry}`);
    
    await this.eIntendedLengthOfStayField.fill(trip.intendedLengthOfStay);
    console.log(`✅ Продолжительность пребывания: ${trip.intendedLengthOfStay} дней`);
    
    await this.ePhoneInVietnamField.fill(trip.phoneNumberInVietnam);
    console.log(`✅ Телефон во Вьетнаме: ${trip.phoneNumberInVietnam}`);
    
    // Адрес во Вьетнаме - пока заполним текстовое поле, селекты могут потребовать дополнительной логики
    // await this.eResidentialAddressSelect.fill(trip.residentialAddressInVietnam);
    console.log(`✅ Адрес во Вьетнаме: ${trip.residentialAddressInVietnam} (требует дальнейшей настройки)`);
    
    // Пункты въезда/выезда тоже могут потребовать специальной логики
    console.log(`✅ Пункт въезда: ${trip.intendedBorderGateOfEntry} (требует дальнейшей настройки)`);
    console.log(`✅ Пункт выезда: ${trip.intendedBorderGateOfExit} (требует дальнейшей настройки)`);
    
    // Checkbox для временной регистрации
    if (trip.committedToDeclareTempResidence) {
      await this.eTempResidenceCheckbox.check();
    }
    console.log(`✅ Обязательство о временной регистрации: ${trip.committedToDeclareTempResidence}`);
    
    // Questions
    if (trip.hasAgencyOrganizationContact === 'Yes') {
      await this.eAgencyContactYes.click();
    } else {
      await this.eAgencyContactNo.click();
    }
    console.log(`✅ Контакты с организациями: ${trip.hasAgencyOrganizationContact}`);
    
    if (trip.beenToVietnamLastYear === 'Yes') {
      await this.eBeenToVietnamYes.click();
    } else {
      await this.eBeenToVietnamNo.click();
    }
    console.log(`✅ Был во Вьетнаме в прошлом году: ${trip.beenToVietnamLastYear}`);
    
    if (trip.hasRelativesInVietnam === 'Yes') {
      await this.eHasRelativesYes.click();
    } else {
      await this.eHasRelativesNo.click();
    }
    console.log(`✅ Есть родственники во Вьетнаме: ${trip.hasRelativesInVietnam}`);
    
    console.log('✅ Раздел "6. INFORMATION ABOUT THE TRIP" заполнен');
  }

  /**
   * Заполняем раздел 8 - Trip Expenses & Insurance
   */
  async aFillTripExpenses(userData: any) {
    console.log('📝 Заполняем раздел "8. TRIP\'S EXPENSES, INSURANCE"...');
    
    const expenses = userData.tripsExpensesInsurance;
    
    await this.eIntendedExpensesField.fill(expenses.intendedExpensesUSD);
    console.log(`✅ Планируемые расходы: $${expenses.intendedExpensesUSD}`);
    
    // Страховка
    await this.eInsuranceSelect.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText(expenses.didBuyInsurance, { exact: true }).click();
    console.log(`✅ Страховка: ${expenses.didBuyInsurance}`);
    
    // Кто покрывает расходы
    await this.eExpensesCoveredBySelect.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText(expenses.whoCoversTripExpenses, { exact: true }).click();
    console.log(`✅ Кто покрывает расходы: ${expenses.whoCoversTripExpenses}`);
    
    console.log('✅ Раздел "8. TRIP\'S EXPENSES, INSURANCE" заполнен');
  }

  /**
   * Ставим финальную галочку согласия
   */
  async aCheckFinalDeclaration() {
    console.log('📋 Проверяем финальную декларацию...');
    
    try {
      // Чекбокс согласия с декларацией
      await this.aFillFieldByType(this.eDeclarationCheckbox, 'Yes', 'declaration.agreed', 'Declaration', 7);
      
      console.log('✅ Финальная декларация проверена');
    } catch (error) {
      console.log(`⚠️ Ошибка при проверке финальной декларации: ${error}`);
    }
  }

  /**
   * ГЛАВНЫЙ МЕТОД - Автозаполнение всей формы с проверкой уже заполненных полей
   */
  async aFillCompleteForm(userData: any) {
    console.log('🚀 Начинаем автозаполнение полной формы Vietnam E-Visa...');
    
    // Инициализируем лог для пользователя
    const userSelection = this.aSelectUserFromConfig();
    this.aInitializeLog(userSelection.userId);
    
    try {
      // Загружаем изображения (если еще не загружены)
      await this.aUploadImagesIfNeeded(userData);
      await this.page.waitForTimeout(3000);
      
      // Заполняем все разделы по порядку с проверкой уже заполненных полей
      await this.aFillPersonalInformationIfNeeded(userData);
      await this.page.waitForTimeout(2000);
      
      await this.aFillRequestedInformationIfNeeded(userData);
      await this.page.waitForTimeout(2000);
      
      await this.aFillPassportInformationIfNeeded(userData);
      await this.page.waitForTimeout(2000);
      
      await this.aFillContactInformationIfNeeded(userData);
      await this.page.waitForTimeout(2000);
      
      await this.aFillOccupationIfNeeded(userData);
      await this.page.waitForTimeout(2000);
      
      await this.aFillTripInformationIfNeeded(userData);
      await this.page.waitForTimeout(2000);
      
      // Раздел 7 (дети) пропускаем, так как данных нет
      
      await this.aFillTripExpensesIfNeeded(userData);
      await this.page.waitForTimeout(2000);
      
      await this.aCheckFinalDeclaration();
      
      // Дополнительная проверка и заполнение проблемных полей
      console.log('🔍 Выполняем дополнительную проверку проблемных полей...');
      await this.aFillProblematicFields(userData);
      
      // Выводим таблицу результатов
      this.aFinalizeLog();
      
      console.log('🎉 Автозаполнение формы завершено успешно!');
      console.log('🔄 Проверьте данные и нажмите "Next" для продолжения');
      
    } catch (error) {
      console.error('❌ Ошибка при автозаполнении:', error);
      // Выводим лог даже при ошибке
      this.aFinalizeLog();
      throw error;
    }
  }

  /**
   * Дополнительная проверка и заполнение проблемных полей
   */
  async aFillProblematicFields(userData: any) {
    console.log('🔧 Проверяем и заполняем проблемные поля...');
    
    const personal = userData.personalInformation;
    const trip = userData.tripInformation;
    
    // Проверяем и заполняем проблемные поля Personal Information
    try {
      // Пол - используем новую логику проверки
      const isSexFilled = await this.aIsAntDesignSelectFilled(this.eSexSelect, personal.sex, 'Sex');
      
      if (!isSexFilled) {
        console.log('🔧 Повторно заполняем поле "Пол" (не заполнено правильно)...');
        await this.aFillAntDesignSelect(this.eSexSelect, personal.sex, 'Пол (повторно)');
        await this.page.waitForTimeout(1000);
      } else {
        console.log('✅ Поле "Пол" уже заполнено правильно');
      }
    } catch (error) {
      console.log('⚠️ Не удалось проверить поле "Пол"');
    }
    
    try {
      // Национальность - используем новую логику проверки
      const isNationalityFilled = await this.aIsAntDesignSelectFilled(this.eNationalitySelect, personal.nationality, 'Nationality');
      
      if (!isNationalityFilled) {
        console.log('🔧 Повторно заполняем поле "Национальность" (не заполнено правильно)...');
        await this.aFillAntDesignSelect(this.eNationalitySelect, personal.nationality, 'Национальность (повторно)');
        await this.page.waitForTimeout(1000);
      } else {
        console.log('✅ Поле "Национальность" уже заполнено правильно');
      }
    } catch (error) {
      console.log('⚠️ Не удалось проверить поле "Национальность"');
    }
    
    // Проверяем и заполняем проблемные поля Trip Information
    try {
      // Район - используем новую логику проверки
      const isWardFilled = await this.aIsAntDesignSelectFilled(this.eWardSelect, trip.wardCommune, 'Ward');
      
      if (!isWardFilled) {
        console.log('🔧 Повторно заполняем поле "Район" (не заполнено правильно)...');
        await this.aFillAntDesignSelect(this.eWardSelect, trip.wardCommune, 'Район (повторно)');
        await this.page.waitForTimeout(1000);
      } else {
        console.log('✅ Поле "Район" уже заполнено правильно');
      }
    } catch (error) {
      console.log('⚠️ Не удалось проверить поле "Район"');
    }
    
    try {
      // Пункт въезда - используем новую логику проверки
      const isEntryGateFilled = await this.aIsAntDesignSelectFilled(this.eBorderGateEntrySelect, trip.intendedBorderGateOfEntry, 'border gate');
      
      if (!isEntryGateFilled) {
        console.log('🔧 Повторно заполняем поле "Пункт въезда" (не заполнено правильно)...');
        await this.aFillAntDesignSelect(this.eBorderGateEntrySelect, trip.intendedBorderGateOfEntry, 'Пункт въезда (повторно)');
        await this.page.waitForTimeout(1000);
      } else {
        console.log('✅ Поле "Пункт въезда" уже заполнено правильно');
      }
    } catch (error) {
      console.log('⚠️ Не удалось проверить поле "Пункт въезда"');
    }
    
    console.log('✅ Дополнительная проверка проблемных полей завершена');
  }

  // Методы для проверки и заполнения полей только при необходимости
  async aUploadImagesIfNeeded(userData: any) {
    console.log('📸 Проверяем загрузку изображений...');
    
    try {
      // Проверяем, загружены ли уже изображения
      const photoUploaded = await this.aIsPhotoUploaded();
      const passportUploaded = await this.aIsPassportUploaded();
      
      if (!photoUploaded) {
        console.log('📸 Загружаем фото...');
        await this.aUploadPhoto(userData.images.portraitPhoto);
      } else {
        console.log('✅ Фото уже загружено');
      }
      
      if (!passportUploaded) {
        console.log('📸 Загружаем страницу паспорта...');
        await this.aUploadPassport(userData.images.passportDataPage);
      } else {
        console.log('✅ Страница паспорта уже загружена');
      }
      
      console.log('✅ Загрузка изображений завершена');
    } catch (error) {
      console.log(`⚠️ Ошибка при загрузке изображений: ${error}`);
    }
  }

  async aIsPhotoUploaded(): Promise<boolean> {
    try {
      // Проверяем наличие загруженного файла в поле фото
      const photoInput = this.page.locator('input[type="file"]').first();
      const fileName = await photoInput.evaluate((el: HTMLInputElement) => el.files?.[0]?.name || '');
      return fileName.length > 0;
    } catch (error) {
      return false;
    }
  }

  async aIsPassportUploaded(): Promise<boolean> {
    try {
      // Проверяем наличие загруженного файла в поле паспорта
      const passportInput = this.page.locator('input[type="file"]').nth(1);
      const fileName = await passportInput.evaluate((el: HTMLInputElement) => el.files?.[0]?.name || '');
      return fileName.length > 0;
    } catch (error) {
      return false;
    }
  }

  async aFillRequestedInformationIfNeeded(userData: any) {
    console.log('📋 Проверяем раздел "REQUESTED INFORMATION"...');
    const requested = userData.requestedInformation;
    
    // Радиокнопка для типа визы
    // await this.aFillFieldByType(
    //   requested.visaType === 'Single-entry' ? this.eSingleEntryRadio : this.eMultipleEntryRadio,
    //   requested.visaType === 'Single-entry' ? 'Yes' : 'No',
    //   'requestedInformation.visaType',
    //   'Requested Information',
    //   6,
    //   { yesRadio: this.eSingleEntryRadio, noRadio: this.eMultipleEntryRadio }
    // );
    
    // Поля даты
    // await this.aFillFieldByType(this.eValidFromField, requested.validFrom, 'requestedInformation.validFrom', 'Requested Information', 5);
    // await this.aFillFieldByType(this.eValidToField, requested.validTo, 'requestedInformation.validTo', 'Requested Information', 5);
  }

  async aFillPassportInformationIfNeeded(userData: any) {
    console.log('🛂 Проверяем раздел "PASSPORT INFORMATION"...');
    const passport = userData.passportInformation;
    
    // Простые текстовые поля
    // await this.aFillFieldByType(this.ePassportNumberField, passport.passportNumber, 'passportInformation.passportNumber', 'Passport Information', 1);
    // await this.aFillFieldByType(this.eIssuingAuthorityField, passport.issuingAuthority, 'passportInformation.issuingAuthority', 'Passport Information', 1);
    
    // Большой выпадающий список
    // await this.aFillFieldByType(this.ePassportTypeSelect, passport.type, 'passportInformation.type', 'Passport Information', 3);
    
    // Поля даты
    // await this.aFillFieldByType(this.ePassportDateOfIssueField, passport.dateOfIssue, 'passportInformation.dateOfIssue', 'Passport Information', 5);
    // await this.aFillFieldByType(this.ePassportExpiryDateField, passport.expiryDate, 'passportInformation.expiryDate', 'Passport Information', 5);
    
    // Радиокнопка для других паспортов
    // await this.aFillFieldByType(
    //   passport.holdOtherValidPassports === 'Yes' ? this.eHoldOtherPassportsYes : this.eHoldOtherPassportsNo,
    //   passport.holdOtherValidPassports,
    //   'passportInformation.holdOtherValidPassports',
    //   'Passport Information',
    //   6,
    //   { yesRadio: this.eHoldOtherPassportsYes, noRadio: this.eHoldOtherPassportsNo }
    // );
  }

  async aFillContactInformationIfNeeded(userData: any) {
    console.log('📞 Проверяем раздел "CONTACT INFORMATION"...');
    const contact = userData.contactInformation;
    
    // Простые текстовые поля
    // await this.aFillFieldByType(this.ePermanentAddressField, contact.permanentResidentialAddress, 'contactInformation.permanentResidentialAddress', 'Contact Information', 1);
    // await this.aFillFieldByType(this.eContactAddressField, contact.contactAddress, 'contactInformation.contactAddress', 'Contact Information', 1);
    // await this.aFillFieldByType(this.eTelephoneNumberField, contact.telephoneNumber, 'contactInformation.telephoneNumber', 'Contact Information', 1);
    
    // Поля экстренного контакта
    // await this.aFillFieldByType(this.eEmergencyContactNameField, contact.emergencyContact.fullName, 'contactInformation.emergencyContact.fullName', 'Contact Information', 1);
    // await this.aFillFieldByType(this.eEmergencyContactAddressField, contact.emergencyContact.currentResidentialAddress, 'contactInformation.emergencyContact.currentResidentialAddress', 'Contact Information', 1);
    // await this.aFillFieldByType(this.eEmergencyContactPhoneField, contact.emergencyContact.telephoneNumber, 'contactInformation.emergencyContact.telephoneNumber', 'Contact Information', 1);
    
    // Выпадающий список для отношения
    // await this.aFillFieldByType(this.eEmergencyContactRelationshipField, contact.emergencyContact.relationship, 'contactInformation.emergencyContact.relationship', 'Contact Information', 2);
  }

  async aFillOccupationIfNeeded(userData: any) {
    console.log('💼 Проверяем раздел "OCCUPATION"...');
    const occupation = userData.occupation;
    
    // Выпадающий список для профессии
    // await this.aFillFieldByType(this.eOccupationSelect, occupation.occupation, 'occupation.occupation', 'Occupation', 2);
    
    // Простые текстовые поля
    // await this.aFillFieldByType(this.eOccupationInfoField, occupation.occupationInfo, 'occupation.occupationInfo', 'Occupation', 1);
    // await this.aFillFieldByType(this.eCompanyNameField, occupation.nameOfCompanyAgencySchool, 'occupation.nameOfCompanyAgencySchool', 'Occupation', 1);
    // await this.aFillFieldByType(this.ePositionField, occupation.positionCourseOfStudy, 'occupation.positionCourseOfStudy', 'Occupation', 1);
    // await this.aFillFieldByType(this.eCompanyAddressField, occupation.addressOfCompanyAgencySchool, 'occupation.addressOfCompanyAgencySchool', 'Occupation', 1);
    // await this.aFillFieldByType(this.eCompanyPhoneField, occupation.companyAgencySchoolPhoneNumber, 'occupation.companyAgencySchoolPhoneNumber', 'Occupation', 1);
  }

  async aFillTripInformationIfNeeded(userData: any) {
    console.log('✈️ Проверяем раздел "TRIP INFORMATION"...');
    const trip = userData.tripInformation;
    
    // Большой выпадающий список для цели въезда
    // await this.aFillFieldByType(this.ePurposeOfEntrySelect, trip.purposeOfEntry, 'tripInformation.purposeOfEntry', 'Trip Information', 3);
    // await this.page.waitForTimeout(1000);
    
    // Поле даты
    // await this.aFillFieldByType(this.eIntendedDateOfEntryField, trip.intendedDateOfEntry, 'tripInformation.intendedDateOfEntry', 'Trip Information', 5);
    // await this.page.waitForTimeout(1000);
    
    // Простые текстовые поля
    // await this.aFillFieldByType(this.eIntendedLengthOfStayField, trip.intendedLengthOfStay, 'tripInformation.intendedLengthOfStay', 'Trip Information', 1);
    // await this.page.waitForTimeout(1000);
    // await this.aFillFieldByType(this.ePhoneInVietnamField, trip.phoneNumberInVietnam, 'tripInformation.phoneNumberInVietnam', 'Trip Information', 1);
    // await this.page.waitForTimeout(1000);
    // await this.aFillFieldByType(this.eResidentialAddressSelect, trip.residentialAddressInVietnam, 'tripInformation.residentialAddressInVietnam', 'Trip Information', 1);
    // await this.page.waitForTimeout(1000);
    
    // Большие выпадающие списки для провинции и пунктов въезда/выезда
    // await this.aFillFieldByType(this.eProvinceSelect, trip.provinceCity, 'tripInformation.provinceCity', 'Trip Information', 3);
    // await this.page.waitForTimeout(2000);
    
    // Зависимый выпадающий список для района
    // await this.aFillFieldByType(
    //   this.eWardSelect, 
    //   trip.wardCommune, 
    //   'tripInformation.wardCommune', 
    //   'Trip Information', 
    //   4,
    //   { dependsOn: this.eProvinceSelect, dependsOnValue: trip.provinceCity }
    // );
    // await this.page.waitForTimeout(2000);
    
    // Большие выпадающие списки для пунктов въезда/выезда
    // await this.aFillFieldByType(this.eBorderGateEntrySelect, trip.intendedBorderGateOfEntry, 'tripInformation.intendedBorderGateOfEntry', 'Trip Information', 3);
    // await this.page.waitForTimeout(1000);
    // await this.aFillFieldByType(this.eBorderGateExitSelect, trip.intendedBorderGateOfExit, 'tripInformation.intendedBorderGateOfExit', 'Trip Information', 3);
    // await this.page.waitForTimeout(1000);
    
    // Чекбокс для обязательства заявить о временном проживании
    // await this.aFillFieldByType(this.eTempResidenceCheckbox, trip.committedToDeclareTempResidence, 'tripInformation.committedToDeclareTempResidence', 'Trip Information', 7);
    
    // Радиокнопки
    // await this.aFillFieldByType(
    //   trip.hasAgencyOrganizationContact === 'Yes' ? this.eAgencyContactYes : this.eAgencyContactNo,
    //   trip.hasAgencyOrganizationContact,
    //   'tripInformation.hasAgencyOrganizationContact',
    //   'Trip Information',
    //   6,
    //   { yesRadio: this.eAgencyContactYes, noRadio: this.eAgencyContactNo }
    // );
    
    // await this.aFillFieldByType(
    //   trip.beenToVietnamLastYear === 'Yes' ? this.eBeenToVietnamYes : this.eBeenToVietnamNo,
    //   trip.beenToVietnamLastYear,
    //   'tripInformation.beenToVietnamLastYear',
    //   'Trip Information',
    //   6,
    //   { yesRadio: this.eBeenToVietnamYes, noRadio: this.eBeenToVietnamNo }
    // );
    
    // await this.aFillFieldByType(
    //   trip.hasRelativesInVietnam === 'Yes' ? this.eHasRelativesYes : this.eHasRelativesNo,
    //   trip.hasRelativesInVietnam,
    //   'tripInformation.hasRelativesInVietnam',
    //   'Trip Information',
    //   6,
    //   { yesRadio: this.eHasRelativesYes, noRadio: this.eHasRelativesNo }
    // );
  }

  async aFillTripExpensesIfNeeded(userData: any) {
    console.log('💰 Проверяем раздел "TRIP EXPENSES"...');
    const expenses = userData.tripsExpensesInsurance;
    
    // Простое текстовое поле для расходов
    // await this.aFillFieldByType(this.eIntendedExpensesField, expenses.intendedExpensesUSD, 'tripsExpensesInsurance.intendedExpensesUSD', 'Trip Expenses', 1);
    
    // Выпадающий список для страхования
    // await this.aFillFieldByType(this.eInsuranceSelect, expenses.didBuyInsurance, 'tripsExpensesInsurance.didBuyInsurance', 'Trip Expenses', 2);
    
    // Простое текстовое поле для указания страхования (если есть)
    // if (expenses.specifyInsurance) {
    //   try {
    //     await this.fillInsuranceSpecifyField(expenses.specifyInsurance);
    //   } catch (error) {
    //     console.log(`⚠️ Ошибка при заполнении поля "Specify" для страхования: ${error}`);
    //   }
    // }
    
    // Выпадающий список для покрытия расходов
    // try {
    //   let expensesField = null;
      
    //   // Способ 1: По тексту "Who will cover"
    //   try {
    //     expensesField = this.page.locator('text=Who will cover').first();
    //     if (await expensesField.count() > 0) {
    //       console.log('✅ Поле "Who will cover the trip\'s expenses" найдено (способ 1)');
    //     }
    //   } catch (error) {
    //     console.log('⚠️ Поле не найдено способом 1');
    //   }
      
    //   // Способ 2: По атрибуту name
    //   if (!expensesField) {
    //     try {
    //       expensesField = this.page.locator('[name*="expenses"], [name*="cover"]').first();
    //       if (await expensesField.count() > 0) {
    //         console.log('✅ Поле "Who will cover the trip\'s expenses" найдено (способ 2)');
    //       }
    //     } catch (error) {
    //       console.log('⚠️ Поле не найдено способом 2');
    //   }
      
    //   // Способ 3: По первому combobox в разделе расходов
    //   if (!expensesField) {
    //     try {
    //       const comboboxes = this.eExpensesSection.locator('combobox');
    //       if (await comboboxes.count() > 0) {
    //         expensesField = comboboxes.nth(1); // Второй combobox (первый - это страхование)
    //         console.log('✅ Поле "Who will cover the trip\'s expenses" найдено (способ 3)');
    //       }
    //     } catch (error) {
    //       console.log('⚠️ Поле не найдено способом 3');
    //     }
    //   }
      
    //   if (expensesField) {
    //     await this.aFillFieldByType(expensesField, expenses.whoCoversTripExpenses, 'tripsExpensesInsurance.whoCoversTripExpenses', 'Trip Expenses', 2);
    //   } else {
    //     console.log('❌ Поле "Who will cover the trip\'s expenses" не найдено');
    //   }
      
    // } catch (error) {
    //   console.log(`⚠️ Ошибка при заполнении поля "Who will cover the trip's expenses": ${error}`);
    // }
    
    // Выпадающий список для способа оплаты
    // if (expenses['Payment method']) {
    //   try {
    //     await this.fillPaymentMethodField(expenses['Payment method']);
    //   } catch (error) {
    //     console.log(`⚠️ Ошибка при заполнении поля "Payment method": ${error}`);
    //   }
    // }
  }

  // Вспомогательные методы для проверки и заполнения полей
  async aFillFieldIfNeeded(field: Locator, expectedValue: string, fieldName: string) {
    try {
      // Проверяем, является ли поле readonly
      const isReadonly = await field.getAttribute('readonly');
      
      if (isReadonly) {
        console.log(`📝 ${fieldName}: поле readonly, используем JavaScript`);
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, expectedValue);
        console.log(`✅ ${fieldName}: заполнено через JavaScript`);
        return;
      }
      
      const currentValue = await field.inputValue();
      if (currentValue === expectedValue) {
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
      } else {
        console.log(`📝 ${fieldName}: заполняем (было: "${currentValue}", нужно: "${expectedValue}")`);
        
        // Очищаем поле перед заполнением
        await field.clear();
        await this.page.waitForTimeout(100);
        
        // Заполняем поле
        await field.fill(expectedValue);
        await this.page.waitForTimeout(100);
        
        console.log(`✅ ${fieldName}: заполнено`);
      }
    } catch (error) {
      console.log(`⚠️ ${fieldName}: не удалось проверить/заполнить - ${error}`);
      
      // Пробуем альтернативный способ через JavaScript
      try {
        console.log(`🔄 ${fieldName}: пробуем заполнить через JavaScript`);
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, expectedValue);
        console.log(`✅ ${fieldName}: заполнено через JavaScript`);
      } catch (jsError) {
        console.log(`❌ ${fieldName}: не удалось заполнить даже через JavaScript - ${jsError}`);
      }
    }
  }

  async aFillDateFieldIfNeeded(field: Locator, expectedValue: string, fieldName: string) {
    try {
      const currentValue = await field.inputValue();
      if (currentValue === expectedValue) {
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
      } else {
        console.log(`📝 ${fieldName}: заполняем (было: "${currentValue}", нужно: "${expectedValue}")`);
        
        // Прокручиваем к элементу
        await field.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
        
        // Фокусируемся на поле
        await field.focus();
        await this.page.waitForTimeout(100);
        
        // Очищаем поле
        await field.clear();
        await this.page.waitForTimeout(100);
        
        // Заполняем через JavaScript для надежности
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('blur', { bubbles: true }));
        }, expectedValue);
        
        // Дополнительно заполняем через Playwright
        await field.fill(expectedValue);
        
        console.log(`✅ ${fieldName}: заполнено`);
      }
    } catch (error) {
      console.log(`⚠️ ${fieldName}: не удалось проверить/заполнить - ${error}`);
      
      // Пробуем только через JavaScript
      try {
        console.log(`🔄 ${fieldName}: пробуем заполнить только через JavaScript`);
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('blur', { bubbles: true }));
        }, expectedValue);
        console.log(`✅ ${fieldName}: заполнено через JavaScript`);
      } catch (jsError) {
        console.log(`❌ ${fieldName}: не удалось заполнить даже через JavaScript - ${jsError}`);
      }
    }
  }

  async aFillSelectFieldIfNeeded(field: Locator, expectedValue: string, fieldName: string) {
    try {
      // Проверяем текущее значение
      const currentValue = await field.textContent();
      console.log(`🔍 ${fieldName}: текущее значение = "${currentValue}", ожидаемое = "${expectedValue}"`);
      
      if (currentValue?.includes(expectedValue)) {
        console.log(`✅ ${fieldName}: уже установлено правильно (${expectedValue})`);
        return;
      }
      
      console.log(`📝 ${fieldName}: устанавливаем (было: "${currentValue}", нужно: "${expectedValue}")`);
      
      // Прокручиваем к элементу и кликаем
      await field.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      
      // Кликаем на поле для открытия выпадающего списка
      await field.click({ force: true });
      await this.page.waitForTimeout(1000);
      
      // Ждем появления выпадающего списка
      const dropdown = this.page.locator('.ant-select-dropdown:visible, .ant-select-item-option:visible');
      await dropdown.first().waitFor({ timeout: 5000 });
      
      // Ищем опцию в выпадающем списке разными способами
      let optionFound = false;
      
      // Способ 1: По точному тексту
      try {
        const exactOption = this.page.locator('.ant-select-item-option').filter({ hasText: expectedValue });
        if (await exactOption.count() > 0) {
          await exactOption.first().click();
          optionFound = true;
          console.log(`✅ ${fieldName}: установлено (точное совпадение)`);
        }
      } catch (error) {
        console.log(`⚠️ ${fieldName}: не найдено точное совпадение для "${expectedValue}"`);
      }
      
      // Способ 2: По частичному совпадению
      if (!optionFound) {
        try {
          const partialOption = this.page.locator('.ant-select-item-option').filter({ hasText: new RegExp(expectedValue, 'i') });
          if (await partialOption.count() > 0) {
            await partialOption.first().click();
            optionFound = true;
            console.log(`✅ ${fieldName}: установлено (частичное совпадение)`);
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: не найдено частичное совпадение для "${expectedValue}"`);
        }
      }
      
      // Способ 3: По атрибуту title
      if (!optionFound) {
        try {
          const titleOption = this.page.locator(`.ant-select-item-option[title*="${expectedValue}"]`);
          if (await titleOption.count() > 0) {
            await titleOption.first().click();
            optionFound = true;
            console.log(`✅ ${fieldName}: установлено (по title)`);
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: не найдено по title для "${expectedValue}"`);
        }
      }
      
      // Способ 4: По содержимому span внутри
      if (!optionFound) {
        try {
          const spanOption = this.page.locator('.ant-select-item-option span').filter({ hasText: expectedValue });
          if (await spanOption.count() > 0) {
            await spanOption.first().click();
            optionFound = true;
            console.log(`✅ ${fieldName}: установлено (по span)`);
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: не найдено по span для "${expectedValue}"`);
        }
      }
      
      // Способ 5: Попробуем кликнуть по любому элементу с нужным текстом
      if (!optionFound) {
        try {
          const anyOption = this.page.locator('*').filter({ hasText: expectedValue }).first();
          await anyOption.click();
          optionFound = true;
          console.log(`✅ ${fieldName}: установлено (общий поиск)`);
        } catch (error) {
          console.log(`⚠️ ${fieldName}: не найдено общим поиском для "${expectedValue}"`);
        }
      }
      
      if (!optionFound) {
        console.log(`❌ ${fieldName}: не удалось найти опцию "${expectedValue}" в выпадающем списке`);
        
        // Показываем доступные опции для отладки
        try {
          const availableOptions = await this.page.locator('.ant-select-item-option').allTextContents();
          console.log(`📋 ${fieldName}: доступные опции: ${availableOptions.join(', ')}`);
        } catch (error) {
          console.log(`⚠️ ${fieldName}: не удалось получить список доступных опций`);
        }
        
        // Закрываем выпадающий список
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
      }
      
      // Принудительно закрываем все выпадающие списки
      try {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(200);
      } catch (error) {
        // Игнорируем ошибку закрытия
      }
      
    } catch (error) {
      console.log(`⚠️ ${fieldName}: не удалось проверить/установить - ${error}`);
      
      // Пытаемся закрыть выпадающий список в случае ошибки
      try {
        await this.page.keyboard.press('Escape');
      } catch (closeError) {
        // Игнорируем ошибку закрытия
      }
    }
  }

  async aCheckCheckboxIfNeeded(checkbox: Locator, shouldBeChecked: boolean, fieldName: string) {
    try {
      const isChecked = await checkbox.isChecked();
      if (isChecked === shouldBeChecked) {
        console.log(`✅ ${fieldName}: уже установлено правильно (${shouldBeChecked ? 'отмечен' : 'не отмечен'})`);
      } else {
        console.log(`📝 ${fieldName}: изменяем (было: ${isChecked}, нужно: ${shouldBeChecked})`);
        await checkbox.setChecked(shouldBeChecked);
        console.log(`✅ ${fieldName}: установлено`);
      }
    } catch (error) {
      console.log(`⚠️ ${fieldName}: не удалось проверить/установить - ${error}`);
    }
  }

  async aCheckRadioButtonIfNeeded(yesRadio: Locator, noRadio: Locator, shouldBeYes: boolean, fieldName: string) {
    try {
      const yesChecked = await yesRadio.isChecked();
      const noChecked = await noRadio.isChecked();
      
      if ((shouldBeYes && yesChecked) || (!shouldBeYes && noChecked)) {
        console.log(`✅ ${fieldName}: уже установлено правильно (${shouldBeYes ? 'Да' : 'Нет'})`);
      } else {
        console.log(`📝 ${fieldName}: изменяем (нужно: ${shouldBeYes ? 'Да' : 'Нет'})`);
        if (shouldBeYes) {
          await yesRadio.click({ force: true });
        } else {
          await noRadio.click({ force: true });
        }
        console.log(`✅ ${fieldName}: установлено`);
      }
    } catch (error) {
      console.log(`⚠️ ${fieldName}: не удалось проверить/установить - ${error}`);
    }
  }

  // Специальный метод для работы с Ant Design Select компонентами
  async aFillAntDesignSelect(field: Locator, expectedValue: string, fieldName: string) {
    // Специальная обработка для адресов и провинций
    if (fieldName.includes('адрес') || fieldName.includes('провинция') || fieldName.includes('район')) {
      return await this.aFillAddressSelect(field, expectedValue, fieldName);
    }
    
    try {
      // Сначала проверяем, не заполнено ли поле уже правильно с помощью нового метода
      const isAlreadyFilled = await this.aIsAntDesignSelectFilled(field, expectedValue, fieldName);
      
      if (isAlreadyFilled) {
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
        return;
      }
      
      console.log(`🔍 ${fieldName}: пытаемся установить "${expectedValue}"`);
      
      // Прокручиваем к элементу
      await field.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);
      
      // Кликаем на поле для открытия выпадающего списка
      await field.click({ force: true });
      await this.page.waitForTimeout(2000);
      
      // Ждем появления выпадающего списка
      try {
        await this.page.locator('.ant-select-dropdown').waitFor({ timeout: 5000 });
      } catch (error) {
        console.log(`⚠️ ${fieldName}: выпадающий список не появился, пробуем другой подход`);
      }
      
      // Ищем опцию разными способами
      let optionFound = false;
      
      // Способ 1: По div с классом ant-select-item-option в текущем выпадающем списке
      try {
        // Находим активный выпадающий список
        const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
        if (await activeDropdown.count() > 0) {
          const options = activeDropdown.locator('.ant-select-item-option');
          const count = await options.count();
          console.log(`📋 ${fieldName}: найдено ${count} опций в активном выпадающем списке`);
          
          // Прокручиваем список, чтобы загрузить все опции
          await activeDropdown.evaluate((el) => {
            el.scrollTop = 0;
          });
          await this.page.waitForTimeout(500);
          
          // Ищем опцию с прокруткой
          for (let i = 0; i < count; i++) {
            const option = options.nth(i);
            const text = await option.textContent();
            console.log(`🔍 ${fieldName}: опция ${i + 1} = "${text}"`);
            
            if (text?.includes(expectedValue)) {
              await option.click();
              optionFound = true;
              console.log(`✅ ${fieldName}: установлено "${expectedValue}" (способ 1)`);
              // Ждем закрытия выпадающего списка и обновления DOM
              await this.page.waitForTimeout(1000);
              break;
            }
            
            // Прокручиваем к следующей опции каждые 10 элементов
            if (i % 10 === 0 && i > 0) {
              await activeDropdown.evaluate((el) => {
                el.scrollTop += 200;
              });
              await this.page.waitForTimeout(200);
            }
          }
          
          // Если не нашли в первом проходе, пробуем прокрутить весь список
          if (!optionFound && count > 10) {
            console.log(`🔍 ${fieldName}: не найдено в первых ${count} опциях, прокручиваем весь список...`);
            
            // Прокручиваем в начало
            await activeDropdown.evaluate((el) => {
              el.scrollTop = 0;
            });
            await this.page.waitForTimeout(500);
            
            // Прокручиваем весь список с шагом
            for (let scrollStep = 0; scrollStep < 10; scrollStep++) {
              await activeDropdown.evaluate((el) => {
                el.scrollTop += 300;
              });
              await this.page.waitForTimeout(300);
              
              // Проверяем видимые опции
              const visibleOptions = activeDropdown.locator('.ant-select-item-option:visible');
              const visibleCount = await visibleOptions.count();
              
              for (let j = 0; j < visibleCount; j++) {
                const option = visibleOptions.nth(j);
                const text = await option.textContent();
                
                if (text?.includes(expectedValue)) {
                  await option.click();
                  optionFound = true;
                  console.log(`✅ ${fieldName}: установлено "${expectedValue}" (способ 1 - после прокрутки)`);
                  await this.page.waitForTimeout(500);
                  break;
                }
              }
              
              if (optionFound) break;
            }
          }
        }
      } catch (error) {
        console.log(`⚠️ ${fieldName}: ошибка при поиске по ant-select-item-option`);
      }
      
      // Способ 2: Поиск по точному совпадению в активном выпадающем списке
      if (!optionFound) {
        try {
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const exactOptions = activeDropdown.locator('.ant-select-item-option').filter({ hasText: new RegExp(`^${expectedValue}$`, 'i') });
            if (await exactOptions.count() > 0) {
              await exactOptions.first().click();
              optionFound = true;
              console.log(`✅ ${fieldName}: установлено "${expectedValue}" (точное совпадение)`);
              // Ждем закрытия выпадающего списка
              await this.page.waitForTimeout(500);
            }
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: ошибка при поиске точного совпадения`);
        }
      }
      
      // Способ 3: Поиск по частичному совпадению в активном выпадающем списке
      if (!optionFound) {
        try {
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const partialOptions = activeDropdown.locator('.ant-select-item-option').filter({ hasText: new RegExp(expectedValue, 'i') });
            if (await partialOptions.count() > 0) {
              await partialOptions.first().click();
              optionFound = true;
              console.log(`✅ ${fieldName}: установлено "${expectedValue}" (способ 3 - частичное совпадение)`);
            }
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: ошибка при поиске по частичному совпадению`);
        }
      }
      
      // Способ 4: Поиск по любому элементу с нужным текстом в активном выпадающем списке
      if (!optionFound) {
        try {
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const anyOption = activeDropdown.locator('*').filter({ hasText: expectedValue });
            if (await anyOption.count() > 0) {
              await anyOption.first().click();
              optionFound = true;
              console.log(`✅ ${fieldName}: установлено "${expectedValue}" (способ 4)`);
            }
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: ошибка при поиске по любому элементу`);
        }
      }
      
      // Способ 5: Поиск по вводу текста в поле
      if (!optionFound) {
        try {
          console.log(`🔍 ${fieldName}: пробуем ввести текст в поле поиска`);
          await field.fill(expectedValue);
          await this.page.waitForTimeout(1000);
          
          // Ищем опцию в отфильтрованном списке
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const filteredOptions = activeDropdown.locator('.ant-select-item-option');
            if (await filteredOptions.count() > 0) {
              await filteredOptions.first().click();
              optionFound = true;
              console.log(`✅ ${fieldName}: установлено "${expectedValue}" (способ 5 - через поиск)`);
            }
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: ошибка при поиске через ввод текста`);
        }
      }
      
      if (!optionFound) {
        console.log(`❌ ${fieldName}: не удалось найти опцию "${expectedValue}"`);
        
        // Показываем все доступные опции в активном выпадающем списке
        try {
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const allOptions = await activeDropdown.locator('.ant-select-item-option').allTextContents();
            const uniqueOptions = [...new Set(allOptions)].filter(text => text && text.trim());
            console.log(`📋 ${fieldName}: доступные опции в активном списке: ${uniqueOptions.join(', ')}`);
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: не удалось получить список опций`);
        }
        
        // Закрываем выпадающий список
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(200);
      }
      
      // Принудительно закрываем все выпадающие списки после завершения
      try {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(200);
      } catch (error) {
        // Игнорируем ошибку закрытия
      }
      
    } catch (error) {
      console.log(`⚠️ ${fieldName}: общая ошибка - ${error}`);
      
      // Пытаемся закрыть выпадающий список
      try {
        await this.page.keyboard.press('Escape');
      } catch (closeError) {
        // Игнорируем ошибку закрытия
      }
    }
  }

  // Специальный метод для работы с адресами и провинциями
  async aFillAddressSelect(field: Locator, expectedValue: string, fieldName: string) {
    try {
      // Сначала проверяем, не заполнено ли поле уже правильно
      const selectionItem = field.locator('.ant-select-selection-item');
      const hasSelectionItem = await selectionItem.count() > 0;
      
      if (hasSelectionItem) {
        const currentValue = await selectionItem.textContent();
        if (currentValue && currentValue.trim() === expectedValue) {
          console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
          return;
        }
      }
      
      // Дополнительная проверка через input value
      const inputElement = field.locator('input');
      const hasInput = await inputElement.count() > 0;
      if (hasInput) {
        const inputValue = await inputElement.inputValue();
        if (inputValue && inputValue.trim() === expectedValue) {
          console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue}) - проверено через input`);
          return;
        }
      }
      
      console.log(`🏠 ${fieldName}: пытаемся установить адрес "${expectedValue}"`);
      
      // Прокручиваем к элементу
      await field.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(500);
      
      // Кликаем на поле для открытия выпадающего списка
      await field.click({ force: true });
      await this.page.waitForTimeout(1000);
      
      // Ждем появления выпадающего списка
      try {
        await this.page.locator('.ant-select-dropdown').waitFor({ timeout: 3000 });
      } catch (error) {
        console.log(`⚠️ ${fieldName}: выпадающий список не появился`);
        return;
      }
      
      // Для адресов и провинций используем более гибкий поиск
      let optionFound = false;
      
      // Способ 1: Поиск по частичному совпадению в активном выпадающем списке
      try {
        const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
        if (await activeDropdown.count() > 0) {
          const partialOptions = activeDropdown.locator('.ant-select-item-option').filter({ hasText: new RegExp(expectedValue, 'i') });
          if (await partialOptions.count() > 0) {
            await partialOptions.first().click();
            optionFound = true;
            console.log(`✅ ${fieldName}: установлено "${expectedValue}" (частичное совпадение)`);
          }
        }
      } catch (error) {
        console.log(`⚠️ ${fieldName}: ошибка при поиске частичного совпадения`);
      }
      
      // Способ 2: Поиск по ключевым словам
      if (!optionFound) {
        try {
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const keywords = expectedValue.split(' ').filter(word => word.length > 2);
            for (const keyword of keywords) {
              const keywordOptions = activeDropdown.locator('.ant-select-item-option').filter({ hasText: new RegExp(keyword, 'i') });
              if (await keywordOptions.count() > 0) {
                await keywordOptions.first().click();
                optionFound = true;
                console.log(`✅ ${fieldName}: установлено по ключевому слову "${keyword}"`);
                break;
              }
            }
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: ошибка при поиске по ключевым словам`);
        }
      }
      
      // Способ 3: Поиск по первым буквам
      if (!optionFound) {
        try {
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const firstWord = expectedValue.split(' ')[0];
            const firstLetterOptions = activeDropdown.locator('.ant-select-item-option').filter({ hasText: new RegExp(`^${firstWord}`, 'i') });
            if (await firstLetterOptions.count() > 0) {
              await firstLetterOptions.first().click();
              optionFound = true;
              console.log(`✅ ${fieldName}: установлено по первому слову "${firstWord}"`);
            }
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: ошибка при поиске по первому слову`);
        }
      }
      
      if (!optionFound) {
        console.log(`❌ ${fieldName}: не удалось найти подходящий адрес для "${expectedValue}"`);
        
        // Показываем доступные опции в активном выпадающем списке
        try {
          const activeDropdown = this.page.locator('.ant-select-dropdown:visible').first();
          if (await activeDropdown.count() > 0) {
            const allOptions = await activeDropdown.locator('.ant-select-item-option').allTextContents();
            const uniqueOptions = [...new Set(allOptions)].filter(text => text && text.trim());
            console.log(`📋 ${fieldName}: доступные опции: ${uniqueOptions.slice(0, 10).join(', ')}...`);
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: не удалось получить список опций`);
        }
        
        // Закрываем выпадающий список
        await this.page.keyboard.press('Escape');
      }
      
    } catch (error) {
      console.log(`⚠️ ${fieldName}: общая ошибка - ${error}`);
      
      // Пытаемся закрыть выпадающий список
      try {
        await this.page.keyboard.press('Escape');
      } catch (closeError) {
        // Игнорируем ошибку закрытия
      }
    }
  }

  // Новый метод для правильной проверки заполненности Ant Design Select полей
  async aIsAntDesignSelectFilled(field: Locator, expectedValue: string, fieldName: string): Promise<boolean> {
    try {
      console.log(`🔍 [DEBUG] Проверяем поле ${fieldName} с ожидаемым значением "${expectedValue}"`);
      
      // Получаем название поля из локатора
      const fieldLabel = await field.getAttribute('aria-label') || 
                        await field.getAttribute('name') || 
                        await field.getAttribute('placeholder') || 
                        fieldName;
      
      const result = await this.page.evaluate((params: { expectedValue: string, fieldName: string, fieldLabel: string }) => {
        const { expectedValue, fieldName, fieldLabel } = params;
        // Ищем все элементы с нужным значением
        const elements = document.querySelectorAll('.ant-select-selection-item');
        const matchingElements: Element[] = [];
        
        elements.forEach((element) => {
          if (element.textContent && element.textContent.includes(expectedValue)) {
            matchingElements.push(element);
          }
        });
        
        console.log(`🔍 [DEBUG] Найдено элементов с "${expectedValue}": ${matchingElements.length}`);
        
        // Проверяем каждый найденный элемент
        for (const element of matchingElements) {
          let currentElement: Element | null = element;
          let level = 0;
          
          // Поднимаемся по DOM дереву, чтобы найти название поля
          while (currentElement && level < 10) {
            // Ищем label или название поля в родительских элементах
            const parentElement = currentElement.parentElement;
            if (parentElement) {
              const labels = parentElement.querySelectorAll('label, .ant-form-item-label label, .ant-form-item-label');
              if (labels && labels.length > 0) {
                const labelText = labels[0].textContent?.trim() || '';
                
                // Проверяем, соответствует ли найденный label нужному полю
                if (labelText.includes(fieldName) || 
                    labelText.includes(fieldLabel) ||
                    (fieldName === 'Пункт выезда' && labelText.includes('exit')) ||
                    (fieldName === 'Пункт въезда' && labelText.includes('entry')) ||
                    (fieldName === 'Провинция' && labelText.includes('Province')) ||
                    (fieldName === 'Район' && labelText.includes('Ward')) ||
                    (fieldName === 'Цель въезда' && labelText.includes('Purpose')) ||
                    (fieldName === 'Профессия' && labelText.includes('Occupation')) ||
                    (fieldName === 'Тип паспорта' && labelText.includes('Type')) ||
                    (fieldName === 'Страхование' && labelText.includes('insurance')) ||
                    (fieldName === 'Расходы покрываются' && labelText.includes('cover'))) {
                  
                  console.log(`✅ [DEBUG] Найдена связь с полем "${labelText}" на уровне ${level}`);
                  return true;
                }
              }
            }
            
            // Проверяем атрибуты самого элемента
            const ariaLabel = currentElement.getAttribute('aria-label');
            const name = currentElement.getAttribute('name');
            const placeholder = currentElement.getAttribute('placeholder');
            
            if ((ariaLabel && (ariaLabel.includes(fieldName) || ariaLabel.includes(fieldLabel))) ||
                (name && (name.includes(fieldName) || name.includes(fieldLabel))) ||
                (placeholder && (placeholder.includes(fieldName) || placeholder.includes(fieldLabel)))) {
              console.log(`✅ [DEBUG] Найдена связь через атрибуты на уровне ${level}`);
              return true;
            }
            
            currentElement = currentElement.parentElement;
            level++;
          }
        }
        
        return false;
      }, { expectedValue, fieldName, fieldLabel });
      
      if (result) {
        console.log(`✅ ${fieldName}: правильно заполнено (метод 1 - .ant-select-selection-item)`);
        return true;
      }
      
      // Метод 2: Проверяем объединенный текст
      const combinedText = await this.page.evaluate((params: { expectedValue: string, fieldName: string }) => {
        const { expectedValue, fieldName } = params;
        const elements = document.querySelectorAll('.ant-select-selection-item');
        
        for (const element of Array.from(elements)) {
          if (element.textContent && element.textContent.includes(expectedValue)) {
            // Ищем родительский элемент с названием поля
            let parent: Element | null = element.parentElement;
            let combinedText = '';
            
            // Собираем текст из родительских элементов
            for (let i = 0; i < 5; i++) {
              if (parent) {
                const labels = parent.querySelectorAll('label, .ant-form-item-label');
                if (labels.length > 0) {
                  combinedText = (labels[0].textContent || '') + (element.textContent || '');
                  break;
                }
                parent = parent.parentElement;
              }
            }
            
            // Проверяем частичные совпадения для сложных названий
            if (fieldName.includes('Страхование') && combinedText.toLowerCase().includes('insurance')) {
              return true;
            }
            if (fieldName.includes('Расходы покрываются') && combinedText.toLowerCase().includes('cover')) {
              return true;
            }
            if (fieldName.includes('Тип паспорта') && combinedText.toLowerCase().includes('type')) {
              return true;
            }
            if (fieldName.includes('Пункт выезда') && combinedText.toLowerCase().includes('exit')) {
              return true;
            }
            if (fieldName.includes('Пункт въезда') && combinedText.toLowerCase().includes('entry')) {
              return true;
            }
            if (fieldName.includes('Провинция') && combinedText.toLowerCase().includes('province')) {
              return true;
            }
            if (fieldName.includes('Район') && combinedText.toLowerCase().includes('ward')) {
              return true;
            }
            if (fieldName.includes('Цель въезда') && combinedText.toLowerCase().includes('purpose')) {
              return true;
            }
            if (fieldName.includes('Профессия') && combinedText.toLowerCase().includes('occupation')) {
              return true;
            }
          }
        }
        
        return false;
      }, { expectedValue, fieldName });
      
      if (combinedText) {
        console.log(`✅ ${fieldName}: правильно заполнено (метод 2 - объединенный текст)`);
        return true;
      }
      
      console.log(`❌ ${fieldName}: не заполнено правильно`);
      return false;
      
    } catch (error) {
      console.log(`⚠️ Ошибка при проверке поля ${fieldName}: ${error}`);
      return false;
    }
  }

  /**
   * Заполняет поле "Specify" для страхования
   */
  async fillInsuranceSpecifyField(specifyValue: string): Promise<void> {
    try {
      console.log(`🔧 Заполняю поле "Specify" для страхования значением: ${specifyValue}`);
      
      // Локатор для поля "Specify" страхования
      const specifyField = this.page.locator('input[id="basic_kpbhGhiCuThe"]');
      
      // Проверяем, что поле существует
      await specifyField.waitFor({ state: 'visible', timeout: 5000 });
      
      // Проверяем, не заполнено ли уже поле
      const currentValue = await specifyField.inputValue();
      if (currentValue && currentValue.trim() !== '') {
        console.log(`✅ Поле "Specify" уже заполнено значением: "${currentValue}"`);
        return;
      }
      
      // Заполняем поле
      await specifyField.fill(specifyValue);
      
      // Проверяем, что значение заполнилось
      const filledValue = await specifyField.inputValue();
      if (filledValue === specifyValue) {
        console.log(`✅ Поле "Specify" успешно заполнено значением: "${specifyValue}"`);
      } else {
        console.log(`⚠️ Поле "Specify" заполнено, но значение не совпадает. Ожидалось: "${specifyValue}", получено: "${filledValue}"`);
      }
      
    } catch (error) {
      console.error(`❌ Ошибка при заполнении поля "Specify" для страхования:`, error);
      throw error;
    }
  }

  /**
   * Заполняет поле "Payment method" (способ оплаты)
   */
  async fillPaymentMethodField(paymentMethod: string): Promise<void> {
    try {
      console.log(`🔧 Заполняю поле "Payment method" значением: ${paymentMethod}`);
      
      // Найдем поле "Payment method" по его уникальному ID
      const result = await this.page.evaluate(() => {
        // Ищем поле по ID, который содержит "HinhThuc" (форма оплаты на вьетнамском)
        const paymentMethodField = document.querySelector('#basic_kpbhHinhThuc');
        
        if (paymentMethodField) {
          return {
            found: true,
            id: paymentMethodField.id,
            text: paymentMethodField.textContent?.trim(),
            className: paymentMethodField.className,
            tagName: paymentMethodField.tagName
          };
        }
        
        // Альтернативный способ: найдем последний элемент с текстом "Choose one"
        const chooseOneElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent?.trim();
          return text === 'Choose one' || text === 'Choose One';
        });
        
        if (chooseOneElements.length > 0) {
          const lastChooseOne = chooseOneElements[chooseOneElements.length - 1];
          const combobox = lastChooseOne.closest('[role="combobox"]');
          
          if (combobox) {
            return {
              found: true,
              text: combobox.textContent?.trim(),
              id: combobox.id,
              className: combobox.className,
              tagName: combobox.tagName
            };
          }
        }
        
        return { found: false };
      });
      
      if (result.found) {
        console.log('✅ Поле "Payment method" найдено');
        
        // Проверяем, не заполнено ли уже поле
        if (result.text && result.text !== '' && result.text !== 'Choose one') {
          console.log(`✅ Поле "Payment method" уже заполнено значением: "${result.text}"`);
          return;
        }
        
        // Заполняем поле через Playwright
        const paymentMethodField = this.page.locator(`#${result.id}`);
        await paymentMethodField.click();
        await this.page.waitForTimeout(1000);
        await this.page.getByText(paymentMethod, { exact: true }).click();
        
        console.log(`✅ Поле "Payment method" успешно заполнено значением: "${paymentMethod}"`);
      } else {
        console.log('⚠️ Поле Payment method не найдено');
      }
      
    } catch (error) {
      console.log(`⚠️ Ошибка при заполнении поля "Payment method": ${error}`);
      // Не выбрасываем ошибку, так как поле может быть необязательным
    }
  }

  /**
   * Заполняет поля "Other Used Passports" (другие использованные паспорта)
   */
  async fillOtherPassportsFields(otherUsedPassports: any[]): Promise<void> {
    try {
      console.log(`🔧 Заполняю поля "Other Used Passports" для ${otherUsedPassports.length} паспорта(ов)`);
      
      for (let i = 0; i < otherUsedPassports.length; i++) {
        const passport = otherUsedPassports[i];
        console.log(`📝 Заполняю данные для паспорта ${i + 1}: ${passport.passportNumber}`);
        
        // 1. Номер паспорта
        const passportNumberField = this.page.locator('#basic_hcKhac_0_soHc');
        await passportNumberField.fill(passport.passportNumber);
        console.log(`✅ Номер паспорта заполнен: ${passport.passportNumber}`);
        
        // 2. Полное имя
        const fullNameField = this.page.locator('#basic_hcKhac_0_hoTen');
        await fullNameField.fill(passport.fullName);
        console.log(`✅ Полное имя заполнено: ${passport.fullName}`);
        
        // 3. Дата рождения (используем Playwright методы)
        const dateOfBirthField = this.page.locator('#basic_hcKhac_0_ngaySinhStr');
        try {
          await dateOfBirthField.clear();
          await dateOfBirthField.type(passport.dateOfBirth);
          console.log(`✅ Дата рождения заполнена: ${passport.dateOfBirth}`);
        } catch (error) {
          console.log(`⚠️ Не удалось заполнить дату рождения "${passport.dateOfBirth}": ${error}`);
        }
        
        // 4. Национальность (select) - используем прямой JavaScript подход
        try {
          // Используем JavaScript для прямого заполнения поля
          const success = await this.page.evaluate((nationality) => {
            const field = document.querySelector('#basic_hcKhac_0_quocTich');
            if (field) {
              // Устанавливаем значение напрямую в input
              const input = field as HTMLInputElement;
              input.value = nationality;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
              
              // Также обновляем отображаемое значение в селекторе
              const selector = field.closest('.ant-select')?.querySelector('.ant-select-selection-item');
              if (selector) {
                selector.textContent = nationality;
              }
              
              // Удаляем placeholder если есть
              const placeholder = field.closest('.ant-select')?.querySelector('.ant-select-selection-placeholder');
              if (placeholder) {
                placeholder.remove();
              }
              
              return true;
            }
            return false;
          }, passport.nationality);
          
          if (success) {
            console.log(`✅ Национальность установлена через JavaScript: ${passport.nationality}`);
          } else {
            console.log(`⚠️ Не удалось установить национальность через JavaScript: ${passport.nationality}`);
          }
          
          // Ждем обновления DOM
          await this.page.waitForTimeout(500);
          
        } catch (error) {
          console.log(`⚠️ Не удалось заполнить национальность "${passport.nationality}": ${error}`);
        }
        
        // Ждем немного между заполнением полей
        await this.page.waitForTimeout(500);
      }
      
      console.log(`✅ Все поля "Other Used Passports" успешно заполнены`);
      
    } catch (error) {
      console.log(`⚠️ Ошибка при заполнении полей "Other Used Passports": ${error}`);
      // Не выбрасываем ошибку, так как поля могут быть необязательными
    }
  }

  /**
   * Логирует заполнение поля в таблицу
   */
  private aLogFieldFill(
    section: string,
    fieldName: string,
    fieldLabel: string,
    expectedValue: string,
    actualValue: string,
    status: 'success' | 'error' | 'skipped' | 'already_filled',
    errorMessage?: string
  ): void {
    const entry: FormFillLogEntry = {
      section,
      fieldName,
      fieldLabel,
      expectedValue,
      actualValue,
      status,
      timestamp: new Date().toISOString(),
      errorMessage
    };
    
    this.formFillLog.entries.push(entry);
    this.formFillLog.totalFields++;
    
    switch (status) {
      case 'success':
        this.formFillLog.successfulFields++;
        break;
      case 'error':
        this.formFillLog.errorFields++;
        break;
      case 'skipped':
      case 'already_filled':
        this.formFillLog.skippedFields++;
        break;
    }
  }

  /**
   * Инициализирует лог для пользователя
   */
  aInitializeLog(userId: string): void {
    this.formFillLog.userId = userId;
    this.formFillLog.testStartTime = new Date().toISOString();
    this.formFillLog.entries = [];
    this.formFillLog.totalFields = 0;
    this.formFillLog.successfulFields = 0;
    this.formFillLog.errorFields = 0;
    this.formFillLog.skippedFields = 0;
    
    console.log('📊 Инициализирован лог заполнения формы для пользователя:', userId);
  }

  /**
   * Завершает лог и выводит таблицу результатов
   */
  aFinalizeLog(): void {
    this.formFillLog.testEndTime = new Date().toISOString();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 ТАБЛИЦА ЗАПОЛНЕНИЯ АНКЕТЫ E-VISA VIETNAM');
    console.log('='.repeat(80));
    
    // Статистика
    console.log(`👤 Пользователь: ${this.formFillLog.userId}`);
    console.log(`⏰ Время начала: ${new Date(this.formFillLog.testStartTime).toLocaleString()}`);
    console.log(`⏰ Время завершения: ${new Date(this.formFillLog.testEndTime).toISOString()}`);
    console.log(`📈 Статистика:`);
    console.log(`   ✅ Успешно заполнено: ${this.formFillLog.successfulFields}`);
    console.log(`   ❌ Ошибки: ${this.formFillLog.errorFields}`);
    console.log(`   ⏭️ Пропущено: ${this.formFillLog.skippedFields}`);
    console.log(`   📊 Всего полей: ${this.formFillLog.totalFields}`);
    
    // Таблица результатов
    console.log('\n📋 ДЕТАЛЬНАЯ ТАБЛИЦА ЗАПОЛНЕНИЯ:');
    console.log('─'.repeat(120));
    console.log('│ Раздел'.padEnd(25) + '│ Поле'.padEnd(30) + '│ Ожидаемое'.padEnd(20) + '│ Фактическое'.padEnd(20) + '│ Статус'.padEnd(12) + '│');
    console.log('─'.repeat(120));
    
    this.formFillLog.entries.forEach(entry => {
      const section = entry.section.padEnd(23);
      const field = entry.fieldName.padEnd(28);
      const expected = String(entry.expectedValue).padEnd(18);
      const actual = String(entry.actualValue).padEnd(18);
      const status = this.getStatusIcon(entry.status).padEnd(10);
      
      console.log(`│ ${section}│ ${field}│ ${expected}│ ${actual}│ ${status}│`);
    });
    
    console.log('─'.repeat(120));
    
    // Сводка по разделам
    console.log('\n📊 СВОДКА ПО РАЗДЕЛАМ:');
    const sectionStats = this.getSectionStats();
    Object.entries(sectionStats).forEach(([section, stats]) => {
      console.log(`📁 ${section}: ${stats.success}/${stats.total} (${Math.round(stats.success/stats.total*100)}%)`);
    });
    
    console.log('='.repeat(80));
    
    // Сохраняем лог в файл
    this.aSaveLogToFile();
  }

  /**
   * Сохраняет лог в файл с таблицей
   */
  private aSaveLogToFile(): void {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Создаем директорию для логов если её нет
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      // Генерируем имя файла с временной меткой
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `form-fill-log-${this.formFillLog.userId}-${timestamp}.txt`;
      const filepath = path.join(logsDir, filename);
      
      // Формируем содержимое файла
      let logContent = '';
      
      // Заголовок
      logContent += '='.repeat(80) + '\n';
      logContent += '📊 ТАБЛИЦА ЗАПОЛНЕНИЯ АНКЕТЫ E-VISA VIETNAM\n';
      logContent += '='.repeat(80) + '\n\n';
      
      // Статистика
      logContent += `👤 Пользователь: ${this.formFillLog.userId}\n`;
      logContent += `⏰ Время начала: ${new Date(this.formFillLog.testStartTime).toLocaleString()}\n`;
      logContent += `⏰ Время завершения: ${this.formFillLog.testEndTime ? new Date(this.formFillLog.testEndTime).toISOString() : 'Не завершено'}\n`;
      logContent += `📈 Статистика:\n`;
      logContent += `   ✅ Успешно заполнено: ${this.formFillLog.successfulFields}\n`;
      logContent += `   ❌ Ошибки: ${this.formFillLog.errorFields}\n`;
      logContent += `   ⏭️ Пропущено: ${this.formFillLog.skippedFields}\n`;
      logContent += `   📊 Всего полей: ${this.formFillLog.totalFields}\n\n`;
      
      // Таблица результатов
      logContent += '📋 ДЕТАЛЬНАЯ ТАБЛИЦА ЗАПОЛНЕНИЯ:\n';
      logContent += '─'.repeat(120) + '\n';
      logContent += '│ Раздел'.padEnd(25) + '│ Поле'.padEnd(30) + '│ Ожидаемое'.padEnd(20) + '│ Фактическое'.padEnd(20) + '│ Статус'.padEnd(12) + '│\n';
      logContent += '─'.repeat(120) + '\n';
      
      this.formFillLog.entries.forEach(entry => {
        const section = entry.section.padEnd(23);
        const field = entry.fieldName.padEnd(28);
        const expected = String(entry.expectedValue).padEnd(18);
        const actual = String(entry.actualValue).padEnd(18);
        const status = this.getStatusIcon(entry.status).padEnd(10);
        
        logContent += `│ ${section}│ ${field}│ ${expected}│ ${actual}│ ${status}│\n`;
      });
      
      logContent += '─'.repeat(120) + '\n\n';
      
      // Сводка по разделам
      logContent += '📊 СВОДКА ПО РАЗДЕЛАМ:\n';
      const sectionStats = this.getSectionStats();
      Object.entries(sectionStats).forEach(([section, stats]) => {
        logContent += `📁 ${section}: ${stats.success}/${stats.total} (${Math.round(stats.success/stats.total*100)}%)\n`;
      });
      
      logContent += '\n' + '='.repeat(80) + '\n';
      
      // Детальная информация об ошибках
      const errorEntries = this.formFillLog.entries.filter(entry => entry.status === 'error');
      if (errorEntries.length > 0) {
        logContent += '\n❌ ДЕТАЛЬНАЯ ИНФОРМАЦИЯ ОБ ОШИБКАХ:\n';
        logContent += '─'.repeat(80) + '\n';
        errorEntries.forEach(entry => {
          logContent += `🔴 ${entry.section} > ${entry.fieldName}\n`;
          logContent += `   Ожидаемое: ${entry.expectedValue}\n`;
          logContent += `   Фактическое: ${entry.actualValue}\n`;
          logContent += `   Ошибка: ${entry.errorMessage}\n`;
          logContent += `   Время: ${new Date(entry.timestamp).toLocaleString()}\n\n`;
        });
      }
      
      // JSON данные для программного анализа
      logContent += '\n📄 JSON ДАННЫЕ ДЛЯ АНАЛИЗА:\n';
      logContent += '─'.repeat(80) + '\n';
      logContent += JSON.stringify(this.formFillLog, null, 2) + '\n';
      
      // Записываем файл
      fs.writeFileSync(filepath, logContent, 'utf8');
      
      console.log(`💾 Лог сохранен в файл: ${filepath}`);
      console.log(`📁 Директория логов: ${logsDir}`);
      
    } catch (error) {
      console.error('❌ Ошибка при сохранении лога в файл:', error);
    }
  }

  /**
   * Возвращает иконку статуса
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'skipped': return '⏭️';
      case 'already_filled': return '✅';
      default: return '❓';
    }
  }

  /**
   * Возвращает статистику по разделам
   */
  private getSectionStats(): Record<string, { success: number; total: number }> {
    const stats: Record<string, { success: number; total: number }> = {};
    
    this.formFillLog.entries.forEach(entry => {
      if (!stats[entry.section]) {
        stats[entry.section] = { success: 0, total: 0 };
      }
      
      stats[entry.section].total++;
      if (entry.status === 'success' || entry.status === 'already_filled') {
        stats[entry.section].success++;
      }
    });
    
    return stats;
  }

  /**
   * Обновляет методы заполнения для логирования
   */
  async aFillFieldIfNeededWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      const isReadonly = await field.getAttribute('readonly');
      
      if (isReadonly) {
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, expectedValue);
        
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'success');
        console.log(`✅ ${fieldName}: заполнено через JavaScript`);
        return;
      }
      
      const currentValue = await field.inputValue();
      if (currentValue === expectedValue) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, currentValue, 'already_filled');
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
      } else {
        await field.clear();
        await this.page.waitForTimeout(100);
        await field.fill(expectedValue);
        await this.page.waitForTimeout(100);
        
        const newValue = await field.inputValue();
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, newValue, 'success');
        console.log(`✅ ${fieldName}: заполнено`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось проверить/заполнить - ${errorMessage}`);
    }
  }

  /**
   * Заполнение поля даты с логированием
   */
  async aFillDateFieldIfNeededWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      const currentValue = await field.inputValue();
      if (currentValue === expectedValue) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, currentValue, 'already_filled');
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
      } else {
        await field.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
        await field.focus();
        await this.page.waitForTimeout(100);
        await field.clear();
        await this.page.waitForTimeout(100);
        
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('blur', { bubbles: true }));
        }, expectedValue);
        
        await field.fill(expectedValue);
        
        const newValue = await field.inputValue();
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, newValue, 'success');
        console.log(`✅ ${fieldName}: заполнено`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось проверить/заполнить - ${errorMessage}`);
    }
  }

  /**
   * Заполнение Ant Design Select с логированием
   */
  async aFillAntDesignSelectWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      const isAlreadyFilled = await this.aIsAntDesignSelectFilled(field, expectedValue, fieldName);
      
      if (isAlreadyFilled) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'already_filled');
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
        return;
      }
      
      await field.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);
      await field.click({ force: true });
      await this.page.waitForTimeout(2000);
      
      try {
        await this.page.locator('.ant-select-dropdown').waitFor({ timeout: 5000 });
      } catch (error) {
        console.log(`⚠️ ${fieldName}: выпадающий список не появился, пробуем другой подход`);
      }
      
      let optionFound = false;
      
      // Способ 1: По точному тексту
      try {
        const exactOption = this.page.locator('.ant-select-item-option').filter({ hasText: expectedValue });
        if (await exactOption.count() > 0) {
          await exactOption.first().click();
          optionFound = true;
          this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'success');
          console.log(`✅ ${fieldName}: установлено (точное совпадение)`);
        }
      } catch (error) {
        console.log(`⚠️ ${fieldName}: не найдено точное совпадение для "${expectedValue}"`);
      }
      
      if (!optionFound) {
        const errorMessage = `Не удалось найти опцию "${expectedValue}" в выпадающем списке`;
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'NOT_FOUND', 'error', errorMessage);
        console.log(`❌ ${fieldName}: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось заполнить - ${errorMessage}`);
    }
  }

  /**
   * Проверка чекбокса с логированием
   */
  async aCheckCheckboxIfNeededWithLog(checkbox: Locator, shouldBeChecked: boolean, fieldName: string, section: string): Promise<void> {
    try {
      const isChecked = await checkbox.isChecked();
      
      if (isChecked === shouldBeChecked) {
        this.aLogFieldFill(section, fieldName, fieldName, shouldBeChecked.toString(), isChecked.toString(), 'already_filled');
        console.log(`✅ ${fieldName}: уже установлено правильно (${shouldBeChecked})`);
      } else {
        if (shouldBeChecked) {
          await checkbox.check();
        } else {
          await checkbox.uncheck();
        }
        
        const newValue = await checkbox.isChecked();
        this.aLogFieldFill(section, fieldName, fieldName, shouldBeChecked.toString(), newValue.toString(), 'success');
        console.log(`✅ ${fieldName}: установлено (${shouldBeChecked})`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, shouldBeChecked.toString(), 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось установить - ${errorMessage}`);
    }
  }

  /**
   * Проверка радиокнопки с логированием
   */
  async aCheckRadioButtonIfNeededWithLog(yesRadio: Locator, noRadio: Locator, shouldBeYes: boolean, fieldName: string, section: string): Promise<void> {
    try {
      const yesChecked = await yesRadio.isChecked();
      const noChecked = await noRadio.isChecked();
      
      if ((shouldBeYes && yesChecked) || (!shouldBeYes && noChecked)) {
        this.aLogFieldFill(section, fieldName, fieldName, shouldBeYes.toString(), shouldBeYes.toString(), 'already_filled');
        console.log(`✅ ${fieldName}: уже установлено правильно (${shouldBeYes ? 'Yes' : 'No'})`);
      } else {
        if (shouldBeYes) {
          await yesRadio.click();
        } else {
          await noRadio.click();
        }
        
        this.aLogFieldFill(section, fieldName, fieldName, shouldBeYes.toString(), shouldBeYes.toString(), 'success');
        console.log(`✅ ${fieldName}: установлено (${shouldBeYes ? 'Yes' : 'No'})`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, shouldBeYes.toString(), 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось установить - ${errorMessage}`);
    }
  }

  /**
   * Единая система правил заполнения полей согласно их типам
   */
  private getFieldFillRule(fieldPath: string, fieldType: number): string {
    const rules: { [key: number]: string } = {
      1: 'simple_input',      // Простой инпут с вводом текста
      2: 'dropdown_select',   // Инпут с выпадающим списком
      3: 'large_dropdown',    // Инпут с выпадающим списком, большой список
      4: 'dependent_dropdown', // Зависимый выпадающий список
      5: 'date_picker',       // Выбор даты
      6: 'radio_button',      // Радио кнопка
      7: 'checkbox',          // Чекбокс
    };
    
    return rules[fieldType] || 'simple_input';
  }

  /**
   * Универсальный метод заполнения поля согласно его типу
   */
  async aFillFieldByType(
    field: Locator, 
    expectedValue: string, 
    fieldName: string, 
    section: string,
    fieldType: number,
    additionalParams?: any
  ): Promise<void> {
    const rule = this.getFieldFillRule(fieldName, fieldType);
    
    try {
      switch (rule) {
        case 'simple_input':
          await this.aFillSimpleInputWithLog(field, expectedValue, fieldName, section);
          break;
          
        case 'dropdown_select':
          await this.aFillDropdownSelectWithLog(field, expectedValue, fieldName, section);
          break;
          
        case 'large_dropdown':
          await this.aFillLargeDropdownWithLog(field, expectedValue, fieldName, section);
          break;
          
        case 'dependent_dropdown':
          await this.aFillDependentDropdownWithLog(field, expectedValue, fieldName, section, additionalParams);
          break;
          
        case 'date_picker':
          await this.aFillDatePickerWithLog(field, expectedValue, fieldName, section);
          break;
          
        case 'radio_button':
          await this.aFillRadioButtonWithLog(field, expectedValue, fieldName, section, additionalParams);
          break;
          
        case 'checkbox':
          await this.aFillCheckboxWithLog(field, expectedValue, fieldName, section);
          break;
          
        case 'file_upload':
          await this.aFillFileUploadWithLog(field, expectedValue, fieldName, section);
          break;
          
        default:
          await this.aFillSimpleInputWithLog(field, expectedValue, fieldName, section);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось заполнить (тип: ${rule}) - ${errorMessage}`);
    }
  }

  /**
   * Заполнение простого текстового поля (тип 1)
   */
  async aFillSimpleInputWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      const isReadonly = await field.getAttribute('readonly');
      
      if (isReadonly) {
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, expectedValue);
        
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'success');
        console.log(`✅ ${fieldName}: заполнено через JavaScript (readonly)`);
        return;
      }
      
      const currentValue = await field.inputValue();
      if (currentValue === expectedValue) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, currentValue, 'already_filled');
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
      } else {
        await field.clear();
        await this.page.waitForTimeout(100);
        await field.fill(expectedValue);
        await this.page.waitForTimeout(100);
        
        const newValue = await field.inputValue();
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, newValue, 'success');
        console.log(`✅ ${fieldName}: заполнено (простой инпут)`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось заполнить простой инпут - ${errorMessage}`);
    }
  }

  /**
   * Заполнение выпадающего списка (тип 2)
   */
  async aFillDropdownSelectWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      const isAlreadyFilled = await this.aIsAntDesignSelectFilled(field, expectedValue, fieldName);
      
      if (isAlreadyFilled) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'already_filled');
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
        return;
      }
      
      await field.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);
      await field.click({ force: true });
      await this.page.waitForTimeout(1500);
      
      try {
        await this.page.locator('.ant-select-dropdown').waitFor({ timeout: 3000 });
      } catch (error) {
        console.log(`⚠️ ${fieldName}: выпадающий список не появился`);
      }
      
      let optionFound = false;
      
      // Поиск опции
      try {
        const exactOption = this.page.locator('.ant-select-item-option').filter({ hasText: expectedValue });
        if (await exactOption.count() > 0) {
          await exactOption.first().click();
          optionFound = true;
          this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'success');
          console.log(`✅ ${fieldName}: установлено (выпадающий список)`);
        }
      } catch (error) {
        console.log(`⚠️ ${fieldName}: не найдено точное совпадение для "${expectedValue}"`);
      }
      
      if (!optionFound) {
        const errorMessage = `Не удалось найти опцию "${expectedValue}" в выпадающем списке`;
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'NOT_FOUND', 'error', errorMessage);
        console.log(`❌ ${fieldName}: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось заполнить выпадающий список - ${errorMessage}`);
    }
  }

  /**
   * Заполнение большого выпадающего списка (тип 3)
   */
  async aFillLargeDropdownWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      const isAlreadyFilled = await this.aIsAntDesignSelectFilled(field, expectedValue, fieldName);
      
      if (isAlreadyFilled) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'already_filled');
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
        return;
      }
      
      await field.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);
      await field.click({ force: true });
      await this.page.waitForTimeout(2000);
      
      try {
        await this.page.locator('.ant-select-dropdown').waitFor({ timeout: 5000 });
      } catch (error) {
        console.log(`⚠️ ${fieldName}: большой выпадающий список не появился`);
      }
      
      let optionFound = false;
      
      // Множественные способы поиска для больших списков
      const searchMethods = [
        () => this.page.locator('.ant-select-item-option').filter({ hasText: expectedValue }),
        () => this.page.locator('.ant-select-item-option').filter({ hasText: new RegExp(expectedValue, 'i') }),
        () => this.page.locator(`.ant-select-item-option[title*="${expectedValue}"]`),
        () => this.page.locator('.ant-select-item-option span').filter({ hasText: expectedValue })
      ];
      
      for (const searchMethod of searchMethods) {
        if (optionFound) break;
        
        try {
          const option = searchMethod();
          if (await option.count() > 0) {
            await option.first().click();
            optionFound = true;
            this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'success');
            console.log(`✅ ${fieldName}: установлено (большой выпадающий список)`);
          }
        } catch (error) {
          console.log(`⚠️ ${fieldName}: метод поиска не сработал`);
        }
      }
      
      if (!optionFound) {
        const errorMessage = `Не удалось найти опцию "${expectedValue}" в большом выпадающем списке`;
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'NOT_FOUND', 'error', errorMessage);
        console.log(`❌ ${fieldName}: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось заполнить большой выпадающий список - ${errorMessage}`);
    }
  }

  /**
   * Заполнение зависимого выпадающего списка (тип 4)
   */
  async aFillDependentDropdownWithLog(
    field: Locator, 
    expectedValue: string, 
    fieldName: string, 
    section: string,
    additionalParams?: any
  ): Promise<void> {
    try {
      // Проверяем, заполнено ли зависимое поле
      if (additionalParams?.dependsOn && additionalParams?.dependsOnValue) {
        const dependentField = additionalParams.dependsOn;
        const dependentValue = additionalParams.dependsOnValue;
        
        const isDependentFilled = await this.aIsAntDesignSelectFilled(dependentField, dependentValue, 'Зависимое поле');
        
        if (!isDependentFilled) {
          const errorMessage = `Зависимое поле не заполнено: ${dependentValue}`;
          this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'DEPENDENCY_NOT_MET', 'error', errorMessage);
          console.log(`❌ ${fieldName}: ${errorMessage}`);
          return;
        }
        
        // Ждем загрузки зависимых данных
        await this.page.waitForTimeout(2000);
      }
      
      // Используем логику большого выпадающего списка
      await this.aFillLargeDropdownWithLog(field, expectedValue, fieldName, section);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось заполнить зависимый выпадающий список - ${errorMessage}`);
    }
  }

  /**
   * Заполнение поля даты (тип 5)
   */
  async aFillDatePickerWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      const currentValue = await field.inputValue();
      if (currentValue === expectedValue) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, currentValue, 'already_filled');
        console.log(`✅ ${fieldName}: уже заполнено правильно (${expectedValue})`);
      } else {
        await field.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(200);
        await field.focus();
        await this.page.waitForTimeout(100);
        await field.clear();
        await this.page.waitForTimeout(100);
        
        // Заполнение через JavaScript для надежности
        await field.evaluate((el: HTMLInputElement, value: string) => {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('blur', { bubbles: true }));
        }, expectedValue);
        
        // Дополнительно заполняем через Playwright
        await field.fill(expectedValue);
        
        const newValue = await field.inputValue();
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, newValue, 'success');
        console.log(`✅ ${fieldName}: заполнено (поле даты)`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось заполнить поле даты - ${errorMessage}`);
    }
  }

  /**
   * Заполнение радиокнопки (тип 6)
   */
  async aFillRadioButtonWithLog(
    field: Locator, 
    expectedValue: any, 
    fieldName: string, 
    section: string,
    additionalParams?: any
  ): Promise<void> {
    try {
      const { yesRadio, noRadio } = additionalParams || {};
      
      if (yesRadio && noRadio) {
        const yesChecked = await yesRadio.isChecked();
        const noChecked = await noRadio.isChecked();
        const shouldBeYes = expectedValue === 'Yes';
        
        if ((shouldBeYes && yesChecked) || (!shouldBeYes && noChecked)) {
          this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'already_filled');
          console.log(`✅ ${fieldName}: уже установлено правильно (${expectedValue})`);
        } else {
          if (shouldBeYes) {
            await yesRadio.click();
          } else {
            await noRadio.click();
          }
          
          this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'success');
          console.log(`✅ ${fieldName}: установлено (радиокнопка: ${expectedValue})`);
        }
      } else {
        // Одиночная радиокнопка
        const isChecked = await field.isChecked();
        const shouldBeChecked = expectedValue === 'Yes' || expectedValue === 'true';
        
        if (isChecked === shouldBeChecked) {
          this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'already_filled');
          console.log(`✅ ${fieldName}: уже установлено правильно (${expectedValue})`);
        } else {
          await field.click();
          this.aLogFieldFill(section, fieldName, fieldName, expectedValue, expectedValue, 'success');
          console.log(`✅ ${fieldName}: установлено (радиокнопка)`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось установить радиокнопку - ${errorMessage}`);
    }
  }

  /**
   * Заполнение чекбокса (тип 7)
   */
  async aFillCheckboxWithLog(field: Locator, expectedValue: any, fieldName: string, section: string): Promise<void> {
    try {
      const isChecked = await field.isChecked();
      const shouldBeChecked = expectedValue === 'Yes' || expectedValue === 'true' || expectedValue === true;
      
      if (isChecked === shouldBeChecked) {
        this.aLogFieldFill(section, fieldName, fieldName, String(expectedValue), String(expectedValue), 'already_filled');
        console.log(`✅ ${fieldName}: уже установлено правильно (${expectedValue})`);
      } else {
        if (shouldBeChecked) {
          await field.check();
        } else {
          await field.uncheck();
        }
        
        const newValue = await field.isChecked();
        this.aLogFieldFill(section, fieldName, fieldName, String(expectedValue), newValue.toString(), 'success');
        console.log(`✅ ${fieldName}: установлено (чекбокс: ${expectedValue})`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, String(expectedValue), 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось установить чекбокс - ${errorMessage}`);
    }
  }

  /**
   * Загрузка файла (тип undefined)
   */
  async aFillFileUploadWithLog(field: Locator, expectedValue: string, fieldName: string, section: string): Promise<void> {
    try {
      // Проверяем, загружен ли уже файл
      const isUploaded = await this.aIsPhotoUploaded() || await this.aIsPassportUploaded();
      
      if (isUploaded) {
        this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'UPLOADED', 'already_filled');
        console.log(`✅ ${fieldName}: файл уже загружен`);
        return;
      }
      
      // Загружаем файл
      await field.setInputFiles(expectedValue);
      await this.page.waitForTimeout(2000);
      
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'UPLOADED', 'success');
      console.log(`✅ ${fieldName}: файл загружен`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.aLogFieldFill(section, fieldName, fieldName, expectedValue, 'ERROR', 'error', errorMessage);
      console.log(`⚠️ ${fieldName}: не удалось загрузить файл - ${errorMessage}`);
    }
  }
} 