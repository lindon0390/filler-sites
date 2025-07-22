import { expect, Locator, Page } from '@playwright/test';
import path from 'path';

export interface UserData {
    // Личные данные
    surname: string;
    name: string;
    birthDate: string;
    gender: 'male' | 'female';
    birthPlace: string;
    nationality: string;
    
    // Паспортные данные
    passportNumber: string;
    passportIssueDate: string;
    passportExpiryDate: string;
    passportIssuePlace: string;
    
    // Контактная информация
    email: string;
    phone: string;
    address: string;
    
    // Информация о поездке
    entryDate: string;
    exitDate: string;
    purpose: string;
    
    // Файлы
    imgPhotoFilename: string;
    imgPassportFilename: string;
}

export default class EvisaVietnamPage {
    readonly page: Page;

    // Элементы для загрузки изображений
    readonly eImgPhoto: Locator;
    readonly eImgPassport: Locator;
    readonly eUploadImgPhoto: Locator;
    readonly eUploadImgPassport: Locator;
    
    // Основные поля формы
    readonly eInputSurname: Locator;
    readonly eInputName: Locator;
    readonly eInputBirthDate: Locator;
    readonly eRadioMale: Locator;
    readonly eRadioFemale: Locator;
    readonly eInputBirthPlace: Locator;
    readonly eSelectNationality: Locator;
    
    // Паспортные данные
    readonly eInputPassportNumber: Locator;
    readonly eInputPassportIssueDate: Locator;
    readonly eInputPassportExpiryDate: Locator;
    readonly eInputPassportIssuePlace: Locator;
    
    // Контактная информация
    readonly eInputEmail: Locator;
    readonly eInputPhone: Locator;
    readonly eInputAddress: Locator;
    
    // Информация о поездке
    readonly eInputEntryDate: Locator;
    readonly eInputExitDate: Locator;
    readonly eSelectPurpose: Locator;
    
    // Кнопки
    readonly eBtnSubmit: Locator;
    readonly eBtnNext: Locator;

    constructor(page: Page) {
        this.page = page;

        // Изображения и загрузка файлов
        this.eImgPhoto = page.locator('//img[@id="anh-dai-dien-default"]');
        this.eImgPassport = page.locator('//img[@id="anh-ho-chieu-default"]');
        this.eUploadImgPhoto = page.locator('//input[@type="file"]').first();
        this.eUploadImgPassport = page.locator('//input[@type="file"]').nth(1);
        
        // Основные поля
        this.eInputSurname = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ten"]');
        this.eInputName = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ho_tt22"]');
        this.eInputBirthDate = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ngaySinh"]');
        this.eRadioMale = page.locator('//input[@value="1"][@name="_khaithithucdientu_WAR_eVisaportlet_gioiTinh"]');
        this.eRadioFemale = page.locator('//input[@value="0"][@name="_khaithithucdientu_WAR_eVisaportlet_gioiTinh"]');
        this.eInputBirthPlace = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_noiSinh"]');
        this.eSelectNationality = page.locator('//select[@id="_khaithithucdientu_WAR_eVisaportlet_quocTich"]');
        
        // Паспортные данные
        this.eInputPassportNumber = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_soHoChieu"]');
        this.eInputPassportIssueDate = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ngayCapHoChieu"]');
        this.eInputPassportExpiryDate = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ngayHetHanHoChieu"]');
        this.eInputPassportIssuePlace = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_noiCapHoChieu"]');
        
        // Контактная информация
        this.eInputEmail = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_email"]');
        this.eInputPhone = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_dienThoai"]');
        this.eInputAddress = page.locator('//textarea[@id="_khaithithucdientu_WAR_eVisaportlet_diaChiLienHe"]');
        
        // Информация о поездке
        this.eInputEntryDate = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ngayNhapCanh"]');
        this.eInputExitDate = page.locator('//input[@id="_khaithithucdientu_WAR_eVisaportlet_ngayXuatCanh"]');
        this.eSelectPurpose = page.locator('//select[@id="_khaithithucdientu_WAR_eVisaportlet_mucDichNhapCanh"]');
        
        // Кнопки
        this.eBtnSubmit = page.locator('//button[@type="submit"]');
        this.eBtnNext = page.getByRole('button', { name: 'Next' });
    }

    async aCheckPage() {
        await expect(this.eImgPhoto).toBeVisible({ timeout: 20000 });
        await expect(this.eImgPassport).toBeVisible({ timeout: 20000 });
        await expect(this.eInputSurname).toBeVisible({ timeout: 20000 });
    }

    async aClickImgPhoto() {
        await this.eImgPhoto.click();
    }
    
    async aClickImgPassport() {
        await this.eImgPassport.click();
    }

    async aUploadFileImgPhoto(filename: string) {
        await this.eUploadImgPhoto.setInputFiles(path.join(__dirname, '../files', filename));
    }
    
    async aUploadFileImgPassport(filename: string) {
        await this.eUploadImgPassport.setInputFiles(path.join(__dirname, '../files', filename));
    }

    async aFillPersonalData(userData: UserData) {
        // Заполнение основных личных данных
        await this.eInputSurname.fill(userData.surname);
        await this.eInputName.fill(userData.name);
        await this.eInputBirthDate.fill(userData.birthDate);
        
        // Выбор пола
        if (userData.gender === 'male') {
            await this.eRadioMale.check();
        } else {
            await this.eRadioFemale.check();
        }
        
        await this.eInputBirthPlace.fill(userData.birthPlace);
        await this.eSelectNationality.selectOption(userData.nationality);
    }

    async aFillPassportData(userData: UserData) {
        // Заполнение паспортных данных
        await this.eInputPassportNumber.fill(userData.passportNumber);
        await this.eInputPassportIssueDate.fill(userData.passportIssueDate);
        await this.eInputPassportExpiryDate.fill(userData.passportExpiryDate);
        await this.eInputPassportIssuePlace.fill(userData.passportIssuePlace);
    }

    async aFillContactData(userData: UserData) {
        // Заполнение контактной информации
        await this.eInputEmail.fill(userData.email);
        await this.eInputPhone.fill(userData.phone);
        await this.eInputAddress.fill(userData.address);
    }

    async aFillTravelData(userData: UserData) {
        // Заполнение информации о поездке
        await this.eInputEntryDate.fill(userData.entryDate);
        await this.eInputExitDate.fill(userData.exitDate);
        await this.eSelectPurpose.selectOption(userData.purpose);
    }

    async aFillAllData(userData: UserData) {
        // Метод для заполнения всех данных формы
        await this.aFillPersonalData(userData);
        await this.aFillPassportData(userData);
        await this.aFillContactData(userData);
        await this.aFillTravelData(userData);
    }

    async aSubmitForm() {
        await this.eBtnSubmit.click();
    }

    async aClickNext() {
        await this.eBtnNext.click();
    }
}