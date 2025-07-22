import { Page, Locator, expect } from '@playwright/test';

export interface FullUserData {
  personalInformation: {
    surname: string;
    middleAndGivenName: string;
    dateOfBirth: string;
    dateOfBirthType: string;
    sex: string;
    nationality: string;
    identityCard: string;
    email: string;
    agreeCreateAccount: boolean;
    religion: string;
    placeOfBirth: string;
    reEnterEmail: string;
    hasOtherPassports: string;
    otherPassports?: Array<{
      passportNumber: string;
      fullName: string;
      dateOfBirth: string;
      nationality: string;
    }>;
    hasMultipleNationalities: string;
    violationOfVietnameseLaws: string;
  };
  requestedInformation: {
    visaType: string;
    validFrom: string;
    validTo: string;
  };
  passportInformation: {
    passportNumber: string;
    issuingAuthority: string;
    type: string;
    dateOfIssue: string;
    expiryDate: string;
    holdOtherValidPassports: string;
    otherValidPassports?: Array<{
      type: string;
      otherTypeSpecify: string;
      passportNumber: string;
      issuingAuthority: string;
      dateOfIssue: string;
      expiryDate: string;
    }>;
  };
  tripInformation: {
    entryDate: string;
    exitDate: string;
    purpose: string;
    portOfEntry: string;
    portOfExit: string;
    beenToVietnamLastYear: string;
    vietnamVisitsLastYear?: Array<{
      fromDate: string;
      toDate: string;
      purposeOfTrip: string;
    }>;
    hasRelativesInVietnam: string;
  };
  accommodationInformation: {
    accommodationType: string;
    invitationFromVietnameseEntity: string;
    contactPersonInVietnam: string;
    address: string;
    phoneNumber: string;
  };
  images: {
    imgPhotoFilename: string;
    imgPassportFilename: string;
  };
  loginCredentials: {
    password: string;
  };
}

export class EvisaVietnamLoginFlowPage {
  readonly page: Page;
  
  // Login page selectors
  readonly eLoginButton: Locator;
  readonly eAccountField: Locator;
  readonly ePasswordField: Locator;
  readonly eCaptchaField: Locator;
  readonly eLoginSubmitButton: Locator;
  
  // Application form selectors
  readonly eApplyNowButton: Locator;
  readonly eAgreementCheckbox1: Locator;
  readonly eAgreementCheckbox2: Locator;
  readonly eNextButton: Locator;
  
  // Personal information selectors
  readonly eSurnameField: Locator;
  readonly eMiddleNameField: Locator;
  readonly eDateOfBirthField: Locator;
  readonly eSexSelect: Locator;
  readonly eNationalitySelect: Locator;
  readonly eIdentityCardField: Locator;
  readonly eReligionField: Locator;
  readonly ePlaceOfBirthField: Locator;
  readonly eReEnterEmailField: Locator;
  
  // Passport information selectors
  readonly ePassportNumberField: Locator;
  readonly eIssuingAuthorityField: Locator;
  readonly ePassportTypeSelect: Locator;
  readonly ePassportIssueDateField: Locator;
  readonly ePassportExpiryDateField: Locator;
  
  // Trip information selectors
  readonly eEntryDateField: Locator;
  readonly eExitDateField: Locator;
  readonly ePurposeSelect: Locator;
  readonly ePortOfEntrySelect: Locator;
  readonly ePortOfExitSelect: Locator;
  
  // Image upload selectors
  readonly ePhotoUpload: Locator;
  readonly ePassportUpload: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Login page
    this.eLoginButton = page.locator('text=Login').first();
    this.eAccountField = page.locator('input[placeholder*="Account"]');
    this.ePasswordField = page.locator('input[type="password"]');
    this.eCaptchaField = page.locator('input[placeholder*="captcha"], input[placeholder*="Captcha"]');
    this.eLoginSubmitButton = page.locator('button:has-text("Login")');
    
    // Application flow
    this.eApplyNowButton = page.locator('text=Apply now');
    this.eAgreementCheckbox1 = page.locator('input[type="checkbox"]').first();
    this.eAgreementCheckbox2 = page.locator('input[type="checkbox"]').last();
    this.eNextButton = page.locator('button:has-text("Next")');
    
    // Form fields - используем более надёжные селекторы
    this.eSurnameField = page.locator('input[id*="ttcnHo"], input[placeholder*="surname"], input[placeholder*="Surname"]');
    this.eMiddleNameField = page.locator('input[id*="ttcnDemVaTen"], input[placeholder*="middle"], input[placeholder*="given"]');
    this.eDateOfBirthField = page.locator('input[id*="NgayThangNamSinh"], input[placeholder*="DD/MM/YYYY"]').first();
    this.eSexSelect = page.locator('select[id*="GioiTinh"], .ant-select:has-text("Male"), .ant-select:has-text("Female")').first();
    this.eNationalitySelect = page.locator('select[id*="QuocTich"], .ant-select').nth(1);
    this.eIdentityCardField = page.locator('input[id*="CCCD"], input[placeholder*="identity"]');
    this.eReligionField = page.locator('input[id*="TonGiao"], input[placeholder*="religion"]');
    this.ePlaceOfBirthField = page.locator('input[id*="NoiSinh"], input[placeholder*="birth"]');
    this.eReEnterEmailField = page.locator('input[id*="EmailXacNhan"], input[placeholder*="email"]').nth(1);
    
    // Passport fields
    this.ePassportNumberField = page.locator('input[id*="SoHoChieu"], input[placeholder*="passport"]');
    this.eIssuingAuthorityField = page.locator('input[id*="NoiCap"], input[placeholder*="authority"]');
    this.ePassportTypeSelect = page.locator('select[id*="LoaiHoChieu"]');
    this.ePassportIssueDateField = page.locator('input[id*="NgayCap"]');
    this.ePassportExpiryDateField = page.locator('input[id*="NgayHetHan"]');
    
    // Trip fields
    this.eEntryDateField = page.locator('input[id*="NgayNhapCanh"]');
    this.eExitDateField = page.locator('input[id*="NgayXuatCanh"]');
    this.ePurposeSelect = page.locator('select[id*="MucDich"]');
    this.ePortOfEntrySelect = page.locator('select[id*="CuaKhauNhap"]');
    this.ePortOfExitSelect = page.locator('select[id*="CuaKhauXuat"]');
    
    // Image uploads
    this.ePhotoUpload = page.locator('input[id*="anhMat"], input[accept*="image"]').first();
    this.ePassportUpload = page.locator('input[id*="anhHoChieu"], input[accept*="image"]').last();
  }

  async aGoToMainPage() {
    await this.page.goto('https://evisa.gov.vn', { timeout: 20000 });
    await expect(this.page).toHaveTitle(/Vietnam/, { timeout: 20000 });
  }

  async aLogin(email: string, password: string) {
    console.log('🔐 Выполняем вход в систему...');
    
    // Нажимаем на Login
    await this.eLoginButton.click();
    
    // Ждём загрузки формы входа
    await this.eAccountField.waitFor({ timeout: 20000 });
    
    // Заполняем данные
    await this.eAccountField.fill(email);
    await this.ePasswordField.fill(password);
    
    // Ждём появления капчи
    await this.eCaptchaField.waitFor({ timeout: 20000 });
    
    console.log('⚠️ Пожалуйста, введите капчу вручную и нажмите Enter для продолжения...');
    
    // Пауза для ручного ввода капчи
    await this.page.pause();
    
    // Ждём успешного входа
    await expect(this.page.locator('.user-icon, .account-info, text=Profile')).toBeVisible({ timeout: 20000 });
    console.log('✅ Успешно вошли в систему!');
  }

  async aStartApplication() {
    console.log('📋 Начинаем подачу заявления...');
    
    await this.eApplyNowButton.click();
    
    // Ждём модального окна
    await this.page.waitForSelector('.ant-modal-content, .modal', { timeout: 20000 });
    
    // Соглашаемся с условиями
    await this.eAgreementCheckbox1.check();
    await this.eAgreementCheckbox2.check();
    
    // Переходим к форме
    await this.eNextButton.click();
    
    // Ждём загрузки основной формы
    await this.eSurnameField.waitFor({ timeout: 20000 });
    console.log('📝 Форма заявления загружена!');
  }

  async aFillPersonalInformation(data: FullUserData) {
    console.log('👤 Заполняем личную информацию...');
    
    await this.eSurnameField.fill(data.personalInformation.surname);
    await this.eMiddleNameField.fill(data.personalInformation.middleAndGivenName);
    await this.eDateOfBirthField.fill(data.personalInformation.dateOfBirth);
    
    // Для select полей используем более надёжный подход
    if (data.personalInformation.sex) {
      try {
        // Пытаемся найти select элемент
        await this.page.selectOption('select[id*="GioiTinh"]', data.personalInformation.sex);
      } catch {
        // Если select не найден, пытаемся кликнуть по dropdown
        await this.page.click('.ant-select:has-text("Sex"), .ant-select:has-text("Male"), .ant-select:has-text("Female")');
        await this.page.click(`text=${data.personalInformation.sex}`);
      }
    }
    
    if (data.personalInformation.identityCard) {
      await this.eIdentityCardField.fill(data.personalInformation.identityCard);
    }
    
    await this.eReligionField.fill(data.personalInformation.religion);
    await this.ePlaceOfBirthField.fill(data.personalInformation.placeOfBirth);
    await this.eReEnterEmailField.fill(data.personalInformation.reEnterEmail);
  }

  async aFillPassportInformation(data: FullUserData) {
    console.log('📘 Заполняем информацию о паспорте...');
    
    await this.ePassportNumberField.fill(data.passportInformation.passportNumber);
    await this.eIssuingAuthorityField.fill(data.passportInformation.issuingAuthority);
    await this.ePassportIssueDateField.fill(data.passportInformation.dateOfIssue);
    await this.ePassportExpiryDateField.fill(data.passportInformation.expiryDate);
  }

  async aFillTripInformation(data: FullUserData) {
    console.log('✈️ Заполняем информацию о поездке...');
    
    await this.eEntryDateField.fill(data.tripInformation.entryDate);
    await this.eExitDateField.fill(data.tripInformation.exitDate);
  }

  async aUploadImages(data: FullUserData) {
    console.log('📸 Загружаем изображения...');
    
    const photoPath = `files/${data.images.imgPhotoFilename}`;
    const passportPath = `files/${data.images.imgPassportFilename}`;
    
    // Загружаем фото
    await this.ePhotoUpload.setInputFiles(photoPath);
    
    // Загружаем паспорт
    await this.ePassportUpload.setInputFiles(passportPath);
    
    // Ждём обработки
    await this.page.waitForTimeout(3000);
  }

  async aFillCompleteForm(userData: FullUserData) {
    await this.aFillPersonalInformation(userData);
    await this.aFillPassportInformation(userData);
    await this.aFillTripInformation(userData);
    await this.aUploadImages(userData);
    
    console.log('🎉 Форма полностью заполнена!');
  }

  async aTakeScreenshot(filename: string) {
    await this.page.screenshot({ 
      path: `test-results/${filename}`, 
      fullPage: true 
    });
  }
} 