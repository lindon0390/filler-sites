import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

interface UserData {
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

test.describe('Vietnam E-Visa Application', () => {
  let userData: UserData;

  test.beforeEach(async () => {
    // Загружаем данные пользователя из JSON файла
    const userDataPath = path.join(process.cwd(), 'files/001/001.json');
    const rawData = readFileSync(userDataPath, 'utf-8');
    userData = JSON.parse(rawData);
  });

  test('Полное заполнение заявления на визу с авторизацией', async ({ page }) => {
    // Увеличиваем таймауты для медленного интернета
    test.setTimeout(120000);

    console.log('🚀 Начинаем процесс подачи заявления на визу...');

    // 1. Переходим на главную страницу
    await page.goto('https://evisa.gov.vn');
    await expect(page).toHaveTitle(/Vietnam Electronic Visa/);

    // 2. Нажимаем на кнопку Login
    console.log('🔐 Переходим на страницу входа...');
    await page.click('text=Login');
    
    // Ждём загрузки страницы входа
    await page.waitForSelector('input[placeholder*="Account"]');

    // 3. Заполняем форму входа
    console.log('📝 Заполняем данные для входа...');
    await page.fill('input[placeholder*="Account"]', userData.personalInformation.email);
    await page.fill('input[type="password"]', userData.loginCredentials.password);

    // 4. Обрабатываем капчу (здесь нужно будет решить капчу вручную или использовать сервис)
    console.log('🔍 Ожидаем решения капчи...');
    await page.waitForSelector('input[placeholder*="captcha"]', { timeout: 10000 });
    
    // Для демонстрации добавим паузу для ручного ввода капчи
    console.log('⚠️  Пожалуйста, введите капчу вручную и нажмите Enter для продолжения...');
    await page.pause(); // Это остановит выполнение для ручного ввода капчи

    // 5. Нажимаем кнопку входа
    await page.click('button:has-text("Login")');
    
    // Ждём успешного входа - появления иконки пользователя
    await page.waitForSelector('.user-icon, .account-info', { timeout: 15000 });
    console.log('✅ Успешно вошли в систему!');

    // 6. Начинаем подачу заявления
    console.log('📋 Начинаем подачу заявления на визу...');
    await page.click('text=Apply now');

    // Ждём появления модального окна с инструкциями
    await page.waitForSelector('.ant-modal-content');

    // 7. Соглашаемся с условиями
    console.log('✅ Принимаем условия и инструкции...');
    await page.check('input[type="checkbox"]:first-of-type');
    await page.check('input[type="checkbox"]:last-of-type');
    
    // Нажимаем Next
    await page.click('button:has-text("Next")');

    // 8. Ждём загрузки основной формы
    await page.waitForSelector('input[id*="ttcnHo"]');
    console.log('📝 Начинаем заполнение основной формы...');

    // 9. Заполняем личную информацию
    await fillPersonalInformation(page, userData);

    // 10. Заполняем информацию о визе
    await fillRequestedInformation(page, userData);

    // 11. Заполняем информацию о паспорте
    await fillPassportInformation(page, userData);

    // 12. Заполняем информацию о поездке
    await fillTripInformation(page, userData);

    // 13. Заполняем информацию о проживании
    await fillAccommodationInformation(page, userData);

    // 14. Загружаем изображения
    await uploadImages(page, userData);

    console.log('🎉 Форма полностью заполнена!');
    
    // Делаем финальный скриншот
    await page.screenshot({ 
      path: `test-results/filled-form-${Date.now()}.png`, 
      fullPage: true 
    });
  });
});

// Функция для заполнения личной информации
async function fillPersonalInformation(page: any, userData: UserData) {
  console.log('👤 Заполняем личную информацию...');

  // Фамилия
  await page.fill('input[id*="ttcnHo"]', userData.personalInformation.surname);
  
  // Имя и отчество
  await page.fill('input[id*="ttcnDemVaTen"]', userData.personalInformation.middleAndGivenName);
  
  // Дата рождения
  await page.fill('input[id*="ttcnNgayThangNamSinhStr"]', userData.personalInformation.dateOfBirth);
  
  // Пол
  await page.selectOption('select[id*="ttcnGioiTinh"]', userData.personalInformation.sex);
  
  // Национальность
  await page.selectOption('select[id*="QuocTich"]', userData.personalInformation.nationality);
  
  // Удостоверение личности
  if (userData.personalInformation.identityCard) {
    await page.fill('input[id*="ttcnCCCD"]', userData.personalInformation.identityCard);
  }
  
  // Религия
  await page.fill('input[id*="TonGiao"]', userData.personalInformation.religion);
  
  // Место рождения
  await page.fill('input[id*="NoiSinh"]', userData.personalInformation.placeOfBirth);
  
  // Повторный ввод email
  await page.fill('input[id*="EmailXacNhan"]', userData.personalInformation.reEnterEmail);

  // Обработка дополнительных полей при выборе "Yes"
  if (userData.personalInformation.hasOtherPassports === 'Yes') {
    await page.click('input[value="Yes"]'); // Выбираем Yes для других паспортов
    
    // Заполняем информацию о других паспортах
    if (userData.personalInformation.otherPassports) {
      for (let i = 0; i < userData.personalInformation.otherPassports.length; i++) {
        const passport = userData.personalInformation.otherPassports[i];
        await page.fill(`input[id*="passport_${i}"]`, passport.passportNumber);
        await page.fill(`input[id*="fullname_${i}"]`, passport.fullName);
        await page.fill(`input[id*="dob_${i}"]`, passport.dateOfBirth);
        await page.fill(`input[id*="nationality_${i}"]`, passport.nationality);
      }
    }
  }
}

// Функция для заполнения информации о запрашиваемой визе
async function fillRequestedInformation(page: any, userData: UserData) {
  console.log('📄 Заполняем информацию о визе...');

  // Тип визы
  await page.selectOption('select[id*="LoaiVisa"]', userData.requestedInformation.visaType);
  
  // Дата начала действия
  await page.fill('input[id*="NgayBatDau"]', userData.requestedInformation.validFrom);
  
  // Дата окончания действия
  await page.fill('input[id*="NgayKetThuc"]', userData.requestedInformation.validTo);
}

// Функция для заполнения информации о паспорте
async function fillPassportInformation(page: any, userData: UserData) {
  console.log('📘 Заполняем информацию о паспорте...');

  // Номер паспорта
  await page.fill('input[id*="SoHoChieu"]', userData.passportInformation.passportNumber);
  
  // Орган выдачи
  await page.fill('input[id*="NoiCap"]', userData.passportInformation.issuingAuthority);
  
  // Тип паспорта
  await page.selectOption('select[id*="LoaiHoChieu"]', userData.passportInformation.type);
  
  // Дата выдачи
  await page.fill('input[id*="NgayCap"]', userData.passportInformation.dateOfIssue);
  
  // Дата окончания
  await page.fill('input[id*="NgayHetHan"]', userData.passportInformation.expiryDate);

  // Обработка других действующих паспортов
  if (userData.passportInformation.holdOtherValidPassports === 'Yes') {
    await page.click('input[value="Yes"]'); // Выбираем Yes для других паспортов
    
    if (userData.passportInformation.otherValidPassports) {
      for (let i = 0; i < userData.passportInformation.otherValidPassports.length; i++) {
        const passport = userData.passportInformation.otherValidPassports[i];
        await page.selectOption(`select[id*="type_${i}"]`, passport.type);
        await page.fill(`input[id*="passport_${i}"]`, passport.passportNumber);
        await page.fill(`input[id*="authority_${i}"]`, passport.issuingAuthority);
        await page.fill(`input[id*="issue_${i}"]`, passport.dateOfIssue);
        await page.fill(`input[id*="expiry_${i}"]`, passport.expiryDate);
      }
    }
  }
}

// Функция для заполнения информации о поездке
async function fillTripInformation(page: any, userData: UserData) {
  console.log('✈️ Заполняем информацию о поездке...');

  // Дата въезда
  await page.fill('input[id*="NgayNhapCanh"]', userData.tripInformation.entryDate);
  
  // Дата выезда
  await page.fill('input[id*="NgayXuatCanh"]', userData.tripInformation.exitDate);
  
  // Цель поездки
  await page.selectOption('select[id*="MucDich"]', userData.tripInformation.purpose);
  
  // Порт въезда
  await page.selectOption('select[id*="CuaKhauNhap"]', userData.tripInformation.portOfEntry);
  
  // Порт выезда
  await page.selectOption('select[id*="CuaKhauXuat"]', userData.tripInformation.portOfExit);

  // Обработка предыдущих поездок во Вьетнам
  if (userData.tripInformation.beenToVietnamLastYear === 'Yes') {
    await page.click('input[value="Yes"]'); // Выбираем Yes для предыдущих поездок
    
    if (userData.tripInformation.vietnamVisitsLastYear) {
      for (let i = 0; i < userData.tripInformation.vietnamVisitsLastYear.length; i++) {
        const visit = userData.tripInformation.vietnamVisitsLastYear[i];
        await page.fill(`input[id*="from_${i}"]`, visit.fromDate);
        await page.fill(`input[id*="to_${i}"]`, visit.toDate);
        await page.fill(`input[id*="purpose_${i}"]`, visit.purposeOfTrip);
      }
    }
  }
}

// Функция для заполнения информации о проживании
async function fillAccommodationInformation(page: any, userData: UserData) {
  console.log('🏨 Заполняем информацию о проживании...');

  // Тип проживания
  await page.selectOption('select[id*="LoaiLuuTru"]', userData.accommodationInformation.accommodationType);
  
  // Приглашение от вьетнамской организации
  await page.selectOption('select[id*="ThiMoi"]', userData.accommodationInformation.invitationFromVietnameseEntity);
  
  // Контактное лицо во Вьетнаме
  await page.fill('input[id*="NguoiLienHe"]', userData.accommodationInformation.contactPersonInVietnam);
  
  // Адрес
  await page.fill('input[id*="DiaChi"]', userData.accommodationInformation.address);
  
  // Номер телефона
  await page.fill('input[id*="SoDienThoai"]', userData.accommodationInformation.phoneNumber);
}

// Функция для загрузки изображений
async function uploadImages(page: any, userData: UserData) {
  console.log('📸 Загружаем изображения...');

  // Путь к фото
  const photoPath = path.join(process.cwd(), 'files', userData.images.imgPhotoFilename);
  const passportPath = path.join(process.cwd(), 'files', userData.images.imgPassportFilename);

  // Загружаем фото
  const photoInput = page.locator('input[id*="anhMat"]');
  await photoInput.setInputFiles(photoPath);

  // Загружаем скан паспорта
  const passportInput = page.locator('input[id*="anhHoChieu"]');
  await passportInput.setInputFiles(passportPath);

  // Ждём обработки изображений
  await page.waitForTimeout(3000);
} 