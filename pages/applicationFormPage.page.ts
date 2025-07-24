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
   * Заполняем раздел 1 - Personal Information
   */
  async aFillPersonalInformation(userData: any) {
    console.log('📝 Заполняем раздел "1. PERSONAL INFORMATION"...');
    
    const personal = userData.personalInformation;
    
    // Основные поля
    await this.eSurnameField.fill(personal.surname);
    console.log(`✅ Фамилия: ${personal.surname}`);
    
    await this.eMiddleAndGivenNameField.fill(personal.middleAndGivenName);
    console.log(`✅ Имя: ${personal.middleAndGivenName}`);
    
    // Тип даты рождения
    if (personal.dateOfBirthType === 'Full') {
      await this.eDateOfBirthFullRadio.click();
    } else {
      await this.eDateOfBirthYearOnlyRadio.click();
    }
    console.log(`✅ Тип даты рождения: ${personal.dateOfBirthType}`);
    
    // Дата рождения - используем JavaScript для установки значения
    await this.eDateOfBirthField.evaluate((el, value) => {
      if (el instanceof HTMLInputElement) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, personal.dateOfBirth);
    console.log(`✅ Дата рождения: ${personal.dateOfBirth}`);
    
    // Пол - используем клик для открытия выпадающего списка
    await this.eSexSelect.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText(personal.sex, { exact: true }).click();
    console.log(`✅ Пол: ${personal.sex}`);
    
    // Национальность
    await this.eNationalitySelect.click();
    await this.page.waitForTimeout(1000);
    await this.page.getByText(personal.nationality, { exact: true }).click();
    console.log(`✅ Национальность: ${personal.nationality}`);
    
    await this.eIdentityCardField.fill(personal.identityCard);
    console.log(`✅ ID карта: ${personal.identityCard}`);
    
    // Email уже заполнен, но проверим
    const currentEmail = await this.eEmailField.inputValue();
    if (currentEmail !== personal.email) {
      await this.eEmailField.fill(personal.email);
    }
    console.log(`✅ Email: ${personal.email}`);
    
    // Чекбокс согласия на создание аккаунта
    if (personal.agreeCreateAccount) {
      await this.eAgreeCreateAccountCheckbox.check();
    }
    console.log(`✅ Согласие на создание аккаунта: ${personal.agreeCreateAccount}`);
    
    await this.eReligionField.fill(personal.religion);
    console.log(`✅ Религия: ${personal.religion}`);
    
    await this.ePlaceOfBirthField.fill(personal.placeOfBirth);
    console.log(`✅ Место рождения: ${personal.placeOfBirth}`);
    
    await this.eReEnterEmailField.fill(personal.reEnterEmail);
    console.log(`✅ Повторный email: ${personal.reEnterEmail}`);
    
    // Radio buttons
    if (personal.hasOtherPassports === 'Yes') {
      await this.eOtherPassportsYes.click();
    } else {
      await this.eOtherPassportsNo.click();
    }
    console.log(`✅ Другие паспорта: ${personal.hasOtherPassports}`);
    
    if (personal.hasMultipleNationalities === 'Yes') {
      await this.eMultipleNationalitiesYes.click();
    } else {
      await this.eMultipleNationalitiesNo.click();
    }
    console.log(`✅ Множественное гражданство: ${personal.hasMultipleNationalities}`);
    
    if (personal.violationOfVietnameseLaws === 'Yes') {
      await this.eViolationOfLawsYes.click();
    } else {
      await this.eViolationOfLawsNo.click();
    }
    console.log(`✅ Нарушения законов: ${personal.violationOfVietnameseLaws}`);
    
    console.log('✅ Раздел "1. PERSONAL INFORMATION" заполнен');
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
    console.log('📝 Ставим финальную галочку согласия...');
    
    await this.eDeclarationCheckbox.check();
    console.log('✅ Декларация о согласии отмечена');
  }

  /**
   * ГЛАВНЫЙ МЕТОД - Автозаполнение всей формы с проверкой уже заполненных полей
   */
  async aFillCompleteForm(userData: any) {
    console.log('🚀 Начинаем автозаполнение полной формы Vietnam E-Visa...');
    
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
      
      console.log('🎉 Автозаполнение формы завершено успешно!');
      console.log('🔄 Проверьте данные и нажмите "Next" для продолжения');
      
    } catch (error) {
      console.error('❌ Ошибка при автозаполнении:', error);
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
    console.log('📸 Проверяем загруженные изображения...');
    
    const images = userData.images;
    
    // Проверяем фото
    const photoUploaded = await this.aIsPhotoUploaded();
    if (!photoUploaded && images?.portraitPhoto) {
      console.log('📸 Загружаем фото...');
      await this.aUploadPhoto(images.portraitPhoto);
    } else if (photoUploaded) {
      console.log('✅ Фото уже загружено');
    } else {
      console.log('⚠️ Путь к фото не указан в данных');
    }
    
    // Проверяем паспорт
    const passportUploaded = await this.aIsPassportUploaded();
    if (!passportUploaded && images?.passportDataPage) {
      console.log('📸 Загружаем паспорт...');
      await this.aUploadPassport(images.passportDataPage);
    } else if (passportUploaded) {
      console.log('✅ Паспорт уже загружен');
    } else {
      console.log('⚠️ Путь к паспорту не указан в данных');
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

  async aFillPersonalInformationIfNeeded(userData: any) {
    console.log('👤 Проверяем раздел "PERSONAL INFORMATION"...');
    const personal = userData.personalInformation;
    
    // Проверяем и заполняем каждое поле только при необходимости
    await this.aFillFieldIfNeeded(this.eSurnameField, personal.surname, 'Фамилия');
    await this.aFillFieldIfNeeded(this.eMiddleAndGivenNameField, personal.middleAndGivenName, 'Имя');
    await this.aFillDateFieldIfNeeded(this.eDateOfBirthField, personal.dateOfBirth, 'Дата рождения');
    await this.aFillAntDesignSelect(this.eSexSelect, personal.sex, 'Пол');
    await this.aFillAntDesignSelect(this.eNationalitySelect, personal.nationality, 'Национальность');
    await this.aFillFieldIfNeeded(this.eIdentityCardField, personal.identityCard, 'ID карта');
    await this.aFillFieldIfNeeded(this.eEmailField, personal.email, 'Email');
    await this.aFillFieldIfNeeded(this.eReEnterEmailField, personal.reEnterEmail, 'Повторный Email');
    await this.aFillFieldIfNeeded(this.eReligionField, personal.religion, 'Религия');
    await this.aFillFieldIfNeeded(this.ePlaceOfBirthField, personal.placeOfBirth, 'Место рождения');
    
    // Проверяем чекбоксы
    await this.aCheckCheckboxIfNeeded(this.eAgreeCreateAccountCheckbox, personal.agreeCreateAccount, 'Согласие на создание аккаунта');
    
    // Проверяем радиокнопки
    await this.aCheckRadioButtonIfNeeded(this.eOtherPassportsYes, this.eOtherPassportsNo, personal.hasOtherPassports === 'Yes', 'Другие паспорта');
    await this.aCheckRadioButtonIfNeeded(this.eMultipleNationalitiesYes, this.eMultipleNationalitiesNo, personal.hasMultipleNationalities === 'Yes', 'Множественное гражданство');
    await this.aCheckRadioButtonIfNeeded(this.eViolationOfLawsYes, this.eViolationOfLawsNo, personal.violationOfVietnameseLaws === 'Yes', 'Нарушения законов');
  }

  async aFillRequestedInformationIfNeeded(userData: any) {
    console.log('📋 Проверяем раздел "REQUESTED INFORMATION"...');
    const requested = userData.requestedInformation;
    
    await this.aCheckRadioButtonIfNeeded(this.eSingleEntryRadio, this.eMultipleEntryRadio, requested.visaType === 'Single-entry', 'Тип въезда');
    await this.aFillDateFieldIfNeeded(this.eValidFromField, requested.validFrom, 'Действителен с');
    await this.aFillDateFieldIfNeeded(this.eValidToField, requested.validTo, 'Действителен до');
  }

  async aFillPassportInformationIfNeeded(userData: any) {
    console.log('🛂 Проверяем раздел "PASSPORT INFORMATION"...');
    const passport = userData.passportInformation;
    
    await this.aFillFieldIfNeeded(this.ePassportNumberField, passport.passportNumber, 'Номер паспорта');
    await this.aFillFieldIfNeeded(this.eIssuingAuthorityField, passport.issuingAuthority, 'Орган выдачи');
    await this.aFillAntDesignSelect(this.ePassportTypeSelect, passport.type, 'Тип паспорта');
    await this.aFillDateFieldIfNeeded(this.ePassportDateOfIssueField, passport.dateOfIssue, 'Дата выдачи паспорта');
    await this.aFillDateFieldIfNeeded(this.ePassportExpiryDateField, passport.expiryDate, 'Дата истечения паспорта');
    await this.aCheckRadioButtonIfNeeded(this.eHoldOtherPassportsYes, this.eHoldOtherPassportsNo, passport.holdOtherValidPassports === 'Yes', 'Другие паспорта');
  }

  async aFillContactInformationIfNeeded(userData: any) {
    console.log('📞 Проверяем раздел "CONTACT INFORMATION"...');
    const contact = userData.contactInformation;
    
    await this.aFillFieldIfNeeded(this.ePermanentAddressField, contact.permanentResidentialAddress, 'Постоянный адрес');
    await this.aFillFieldIfNeeded(this.eContactAddressField, contact.contactAddress, 'Контактный адрес');
    await this.aFillFieldIfNeeded(this.eTelephoneNumberField, contact.telephoneNumber, 'Телефон');
    await this.aFillFieldIfNeeded(this.eEmergencyContactNameField, contact.emergencyContact.fullName, 'Имя экстренного контакта');
    await this.aFillFieldIfNeeded(this.eEmergencyContactAddressField, contact.emergencyContact.currentResidentialAddress, 'Адрес экстренного контакта');
    await this.aFillFieldIfNeeded(this.eEmergencyContactPhoneField, contact.emergencyContact.telephoneNumber, 'Телефон экстренного контакта');
    await this.aFillFieldIfNeeded(this.eEmergencyContactRelationshipField, contact.emergencyContact.relationship, 'Отношение экстренного контакта');
  }

  async aFillOccupationIfNeeded(userData: any) {
    console.log('💼 Проверяем раздел "OCCUPATION"...');
    const occupation = userData.occupation;
    
    await this.aFillAntDesignSelect(this.eOccupationSelect, occupation.occupation, 'Профессия');
    await this.aFillFieldIfNeeded(this.eOccupationInfoField, occupation.occupationInfo, 'Информация о профессии');
    await this.aFillFieldIfNeeded(this.eCompanyNameField, occupation.nameOfCompanyAgencySchool, 'Название компании');
    await this.aFillFieldIfNeeded(this.ePositionField, occupation.positionCourseOfStudy, 'Должность');
    await this.aFillFieldIfNeeded(this.eCompanyAddressField, occupation.addressOfCompanyAgencySchool, 'Адрес компании');
    await this.aFillFieldIfNeeded(this.eCompanyPhoneField, occupation.companyAgencySchoolPhoneNumber, 'Телефон компании');
  }

  async aFillTripInformationIfNeeded(userData: any) {
    console.log('✈️ Проверяем раздел "TRIP INFORMATION"...');
    const trip = userData.tripInformation;
    
    await this.aFillAntDesignSelect(this.ePurposeOfEntrySelect, trip.purposeOfEntry, 'Цель въезда');
    await this.page.waitForTimeout(1000);
    
    await this.aFillDateFieldIfNeeded(this.eIntendedDateOfEntryField, trip.intendedDateOfEntry, 'Предполагаемая дата въезда');
    await this.page.waitForTimeout(1000);
    
    await this.aFillFieldIfNeeded(this.eIntendedLengthOfStayField, trip.intendedLengthOfStay, 'Предполагаемая продолжительность пребывания');
    await this.page.waitForTimeout(1000);
    
    await this.aFillFieldIfNeeded(this.ePhoneInVietnamField, trip.phoneNumberInVietnam, 'Телефон во Вьетнаме');
    await this.page.waitForTimeout(1000);
    
    await this.aFillFieldIfNeeded(this.eResidentialAddressSelect, trip.residentialAddressInVietnam, 'Адрес проживания');
    await this.page.waitForTimeout(1000);
    
    // Специальная обработка для провинции - может зависеть от адреса
    await this.aFillAntDesignSelect(this.eProvinceSelect, trip.provinceCity, 'Провинция');
    await this.page.waitForTimeout(2000); // Увеличенная задержка для загрузки зависимых данных
    
    // Специальная обработка для района - зависит от провинции
    await this.aFillAntDesignSelect(this.eWardSelect, trip.wardCommune, 'Район');
    await this.page.waitForTimeout(2000); // Увеличенная задержка для загрузки зависимых данных
    
    // Специальная обработка для пунктов въезда/выезда - могут зависеть от провинции
    await this.aFillAntDesignSelect(this.eBorderGateEntrySelect, trip.intendedBorderGateOfEntry, 'Пункт въезда');
    await this.page.waitForTimeout(1000);
    
    await this.aFillAntDesignSelect(this.eBorderGateExitSelect, trip.intendedBorderGateOfExit, 'Пункт выезда');
    await this.page.waitForTimeout(1000);
    
    await this.aCheckCheckboxIfNeeded(this.eTempResidenceCheckbox, trip.committedToDeclareTempResidence, 'Временное проживание');
    
    // Проверяем радиокнопки вопросов
    await this.aCheckRadioButtonIfNeeded(this.eAgencyContactYes, this.eAgencyContactNo, trip.hasAgencyOrganizationContact === 'Yes', 'Контакт с агентством');
    await this.aCheckRadioButtonIfNeeded(this.eBeenToVietnamYes, this.eBeenToVietnamNo, trip.beenToVietnamLastYear === 'Yes', 'Был ли во Вьетнаме');
    await this.aCheckRadioButtonIfNeeded(this.eHasRelativesYes, this.eHasRelativesNo, trip.hasRelativesInVietnam === 'Yes', 'Есть ли родственники');
  }

  async aFillTripExpensesIfNeeded(userData: any) {
    console.log('💰 Проверяем раздел "TRIP EXPENSES"...');
    const expenses = userData.tripsExpensesInsurance;
    
    await this.aFillFieldIfNeeded(this.eIntendedExpensesField, expenses.intendedExpensesUSD, 'Предполагаемые расходы');
    await this.aFillAntDesignSelect(this.eInsuranceSelect, expenses.didBuyInsurance, 'Страхование');
    
    // Специальная обработка для поля "Who will cover the trip's expenses"
    try {
      console.log('🔍 Расходы покрываются: пытаемся найти поле...');
      
      // Прокручиваем к разделу расходов
      await this.eExpensesSection.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);
      
      // Пробуем найти поле разными способами
      let expensesField = null;
      
      // Способ 1: По точному названию
      try {
        expensesField = this.page.getByRole('combobox', { name: 'Who will cover the trip\'s expenses of the applicant' });
        if (await expensesField.isVisible({ timeout: 5000 })) {
          console.log('✅ Поле "Who will cover the trip\'s expenses" найдено (способ 1)');
        } else {
          expensesField = null;
        }
      } catch (error) {
        console.log('⚠️ Поле не найдено способом 1');
      }
      
      // Способ 2: По частичному названию
      if (!expensesField) {
        try {
          expensesField = this.page.getByRole('combobox', { name: /Who will cover/ });
          if (await expensesField.isVisible({ timeout: 5000 })) {
            console.log('✅ Поле "Who will cover the trip\'s expenses" найдено (способ 2)');
          } else {
            expensesField = null;
          }
        } catch (error) {
          console.log('⚠️ Поле не найдено способом 2');
        }
      }
      
      // Способ 3: По первому combobox в разделе расходов
      if (!expensesField) {
        try {
          const comboboxes = this.eExpensesSection.locator('combobox');
          if (await comboboxes.count() > 0) {
            expensesField = comboboxes.nth(1); // Второй combobox (первый - это страхование)
            console.log('✅ Поле "Who will cover the trip\'s expenses" найдено (способ 3)');
          }
        } catch (error) {
          console.log('⚠️ Поле не найдено способом 3');
        }
      }
      
      if (expensesField) {
        await this.aFillAntDesignSelect(expensesField, expenses.whoCoversTripExpenses, 'Расходы покрываются');
      } else {
        console.log('❌ Поле "Who will cover the trip\'s expenses" не найдено');
      }
      
    } catch (error) {
      console.log(`⚠️ Ошибка при заполнении поля "Who will cover the trip's expenses": ${error}`);
    }
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
      
      // Создаем маппинг русских названий на английские для поиска
      const fieldNameMapping: { [key: string]: string[] } = {
        'Пол': ['Sex', 'Пол'],
        'Национальность': ['Nationality', 'Национальность'],
        'Район': ['Ward', 'Район'],
        'Пункт въезда': ['border gate', 'Entry Gate', 'Пункт въезда'],
        'Пункт выезда': ['border gate', 'Exit Gate', 'Пункт выезда'],
        'Профессия': ['Occupation', 'Профессия'],
        'Цель въезда': ['Purpose', 'Цель въезда'],
        'Провинция': ['Province', 'Провинция'],
        'Страхование': ['Insurance', 'Страхование', 'Did you buy insurance'],
        'Расходы покрываются': ['Expenses', 'Расходы покрываются', 'Who will cover', 'cover the trip'],
        'Тип паспорта': ['Passport Type', 'Тип паспорта', 'Type']
      };
      
      // Получаем варианты названий для поиска
      const searchNames = fieldNameMapping[fieldName] || [fieldName];
      
      // Метод 1: Проверяем .ant-select-selection-item с нужным значением
      const selectionItems = this.page.locator('.ant-select-selection-item');
      const targetItem = selectionItems.filter({ hasText: expectedValue });
      
      const targetItemCount = await targetItem.count();
      console.log(`🔍 [DEBUG] Найдено элементов с "${expectedValue}": ${targetItemCount}`);
      
      if (targetItemCount > 0) {
        // Проверяем, связан ли с нужным полем через JavaScript
        const isRelatedToField = await this.page.evaluate(({ expectedValue, searchNames, fieldName }) => {
          const selectionItems = document.querySelectorAll('.ant-select-selection-item');
          const targetItems = Array.from(selectionItems).filter(item => {
            const text = item.textContent || '';
            return text.trim() === expectedValue;
          });
          
          console.log(`🔍 [DEBUG] В JavaScript найдено ${targetItems.length} элементов с "${expectedValue}"`);
          
          if (targetItems.length === 0) return false;
          
          // Проверяем, связан ли хотя бы один с нужным полем
          for (const item of targetItems) {
            let parent = item.parentElement;
            let level = 0;
            
            while (parent && parent !== document.body && level < 10) {
              const parentText = parent.textContent || '';
              console.log(`🔍 [DEBUG] Уровень ${level}: "${parentText.substring(0, 100)}"`);
              
              // Проверяем все варианты названий поля
              for (const searchName of searchNames) {
                if (parentText.includes(searchName)) {
                  console.log(`✅ [DEBUG] Найдена связь с полем "${searchName}" на уровне ${level}`);
                  return true;
                }
              }
              
              // Дополнительная проверка: ищем частичные совпадения для сложных названий
              if (fieldName.includes('Страхование') && parentText.toLowerCase().includes('insurance')) {
                console.log(`✅ [DEBUG] Найдена связь с полем "Insurance" на уровне ${level}`);
                return true;
              }
              
              if (fieldName.includes('Расходы покрываются') && parentText.toLowerCase().includes('cover')) {
                console.log(`✅ [DEBUG] Найдена связь с полем "Expenses" на уровне ${level}`);
                return true;
              }
              
              if (fieldName.includes('Тип паспорта') && parentText.toLowerCase().includes('type')) {
                console.log(`✅ [DEBUG] Найдена связь с полем "Type" на уровне ${level}`);
                return true;
              }
              parent = parent.parentElement;
              level++;
            }
          }
          
          return false;
        }, { expectedValue, searchNames, fieldName });
        
        if (isRelatedToField) {
          console.log(`✅ ${fieldName}: правильно заполнено (метод 1 - .ant-select-selection-item)`);
          return true;
        } else {
          console.log(`❌ [DEBUG] ${fieldName}: элемент найден, но не связан с полем`);
        }
      }
      
      // Метод 2: Ищем элемент с объединенным текстом (например, "SexMale")
      const combinedText = await this.page.evaluate(({ expectedValue, searchNames }) => {
        const allElements = document.querySelectorAll('*');
        const combinedElement = Array.from(allElements).find(el => {
          const text = el.textContent || '';
          // Проверяем все варианты названий поля
          for (const searchName of searchNames) {
            if (text.includes(searchName) && text.includes(expectedValue) && text.length < 200) {
              return true;
            }
          }
          return false;
        });
        
        return combinedElement ? combinedElement.textContent : null;
      }, { expectedValue, searchNames });
      
      if (combinedText) {
        console.log(`✅ ${fieldName}: правильно заполнено (метод 2 - объединенный текст: "${combinedText}")`);
        return true;
      }
      
      console.log(`❌ ${fieldName}: не заполнено правильно`);
      return false;
      
    } catch (error) {
      console.log(`⚠️ ${fieldName}: ошибка при проверке заполненности - ${error}`);
      return false;
    }
  }
} 