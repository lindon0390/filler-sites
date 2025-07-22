import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import EvisaVietnamPage, { UserData } from '../pages/evisaVietnam.page';
import EvisaVietnamAgreementPage from '../pages/evisaVietnamAgreement.page';

interface FullUserData {
  personalInformation: {
    surname: string;
    middleAndGivenName: string;
    dateOfBirth: string;
    sex: string;
    nationality: string;
    placeOfBirth: string;
    email: string;
  };
  passportInformation: {
    passportNumber: string;
    issuingAuthority: string;
    dateOfIssue: string;
    expiryDate: string;
  };
  tripInformation: {
    intendedDateOfEntry: string;
    intendedLengthOfStay: string;
    purposeOfEntry: string;
    phoneNumberInVietnam: string;
    residentialAddressInVietnam: string;
  };
  images: {
    portraitPhoto: string;
    passportDataPage: string;
  };
}

// Функция для преобразования нового формата в старый
function convertToLegacyFormat(newData: FullUserData): UserData {
  return {
    surname: newData.personalInformation.surname,
    name: newData.personalInformation.middleAndGivenName,
    birthDate: newData.personalInformation.dateOfBirth,
    gender: newData.personalInformation.sex as 'male' | 'female',
    birthPlace: newData.personalInformation.placeOfBirth,
    nationality: newData.personalInformation.nationality,
    passportNumber: newData.passportInformation.passportNumber,
    passportIssueDate: newData.passportInformation.dateOfIssue,
    passportExpiryDate: newData.passportInformation.expiryDate,
    passportIssuePlace: newData.passportInformation.issuingAuthority,
    email: newData.personalInformation.email,
    phone: newData.tripInformation.phoneNumberInVietnam || '',
    address: newData.tripInformation.residentialAddressInVietnam || '',
    entryDate: newData.tripInformation.intendedDateOfEntry,
    exitDate: newData.tripInformation.intendedLengthOfStay,
    purpose: newData.tripInformation.purposeOfEntry,
    imgPhotoFilename: newData.images.portraitPhoto,
    imgPassportFilename: newData.images.passportDataPage
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.describe('Vietnam E-Visa Application (Исправленная версия)', () => {
    let userData: FullUserData;

    test.beforeEach(async () => {
        // Загружаем данные пользователя из JSON файла
        const userDataPath = path.join(process.cwd(), 'files/001/001.json');
        const rawData = readFileSync(userDataPath, 'utf-8');
        userData = JSON.parse(rawData);
    });

    test('Полное заполнение формы заявки на электронную визу', async ({ page }) => {
        const evisaVietnamAgreementPage = new EvisaVietnamAgreementPage(page);
        
        // Переходим на страницу соглашения
        await evisaVietnamAgreementPage.aGoToEvisaPage();
        await evisaVietnamAgreementPage.aAcceptAgreement();
        
        const evisaVietnamPage = new EvisaVietnamPage(page);
        await evisaVietnamPage.aCheckPage();
        
        // Загрузка изображений
        await evisaVietnamPage.aUploadFileImgPhoto(userData.images.portraitPhoto);
        await evisaVietnamPage.aUploadFileImgPassport(userData.images.passportDataPage);
        
        // Заполнение всех данных формы
        const legacyUserData = convertToLegacyFormat(userData);
        await evisaVietnamPage.aFillAllData(legacyUserData);
        
        await delay(2000); // Пауза для проверки заполнения
        
        // Можно добавить проверки заполнения полей
        // await expect(evisaVietnamPage.eInputSurname).toHaveValue(userData.personalInformation.surname);
        
        // Делаем скриншот заполненной формы
        await page.screenshot({ 
            path: `test-results/filled-form-${Date.now()}.png`, 
            fullPage: true 
        });
    });

    test('Тест только загрузки изображений', async ({ page }) => {
        const evisaVietnamAgreementPage = new EvisaVietnamAgreementPage(page);
        
        // Переходим на страницу соглашения
        await evisaVietnamAgreementPage.aGoToEvisaPage();
        await evisaVietnamAgreementPage.aAcceptAgreement();
        
        const evisaVietnamPage = new EvisaVietnamPage(page);
        await evisaVietnamPage.aCheckPage();
        
        // Только загрузка изображений
        await evisaVietnamPage.aUploadFileImgPhoto(userData.images.portraitPhoto);
        await evisaVietnamPage.aUploadFileImgPassport(userData.images.passportDataPage);
        
        await delay(3000); // Пауза для проверки загрузки
        
        // Скриншот с загруженными изображениями
        await page.screenshot({ 
            path: `test-results/uploaded-images-${Date.now()}.png`, 
            fullPage: true 
        });
    });

    test('Тест заполнения только личных данных', async ({ page }) => {
        const evisaVietnamAgreementPage = new EvisaVietnamAgreementPage(page);
        
        // Переходим на страницу соглашения
        await evisaVietnamAgreementPage.aGoToEvisaPage();
        await evisaVietnamAgreementPage.aAcceptAgreement();
        
        const evisaVietnamPage = new EvisaVietnamPage(page);
        await evisaVietnamPage.aCheckPage();
        
        // Заполнение только личных данных
        const legacyUserData = convertToLegacyFormat(userData);
        await evisaVietnamPage.aFillPersonalData(legacyUserData);
        
        await delay(2000);
        
        // Скриншот с заполненными личными данными
        await page.screenshot({ 
            path: `test-results/personal-data-${Date.now()}.png`, 
            fullPage: true 
        });
    });
}); 