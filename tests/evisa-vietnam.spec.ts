import { test, expect } from '@playwright/test';
import EvisaVietnamAgreementPage from '../pages/evisaVietnamAgreement.page';
import { delay } from '../utils';
import EvisaVietnamPage, { UserData } from '../pages/evisaVietnam.page';
import userData from '../userData.json';

const urlEvisa = 'https://evisa.xuatnhapcanh.gov.vn/en_US/web/guest/khai-thi-thuc-dien-tu/cap-thi-thuc-dien-tu';

test.describe('Evisa Vietnam', () => {

    test('Полное заполнение формы заявки на электронную визу', async ({ page }) => {
        // Переход на страницу электронной визы
        await page.goto(urlEvisa);

        // Этап 1: Принятие соглашения
        const evisaVietnamAgreementPage = new EvisaVietnamAgreementPage(page);
        await evisaVietnamAgreementPage.aCheckPage();

        await evisaVietnamAgreementPage.aIsNotCheckedCheckboxAgreement();
        await evisaVietnamAgreementPage.aCheckCheckboxAgreement();
        await evisaVietnamAgreementPage.aIsCheckedCheckboxAgreement();
        await evisaVietnamAgreementPage.aClickBtnNext();
        
        // Этап 2: Заполнение основной формы
        const evisaVietnamPage = new EvisaVietnamPage(page);
        await evisaVietnamPage.aCheckPage();
        
        // Загрузка изображений
        await evisaVietnamPage.aUploadFileImgPhoto(userData.imgPhotoFilename);
        await evisaVietnamPage.aUploadFileImgPassport(userData.imgPassportFilename);
        
        // Заполнение всех данных формы
        await evisaVietnamPage.aFillAllData(userData as UserData);
        
        await delay(2000); // Пауза для проверки заполнения

        // Можно добавить проверки заполнения полей
        // await expect(evisaVietnamPage.eInputSurname).toHaveValue(userData.surname);
        // await expect(evisaVietnamPage.eInputName).toHaveValue(userData.name);
        
        // Отправка формы (раскомментировать когда будет готово к реальной отправке)
        // await evisaVietnamPage.aSubmitForm();
        
        console.log('Форма успешно заполнена!');
    });

    test('Тест только загрузки изображений', async ({ page }) => {
        await page.goto(urlEvisa);

        const evisaVietnamAgreementPage = new EvisaVietnamAgreementPage(page);
        await evisaVietnamAgreementPage.aCheckPage();
        await evisaVietnamAgreementPage.aCheckCheckboxAgreement();
        await evisaVietnamAgreementPage.aClickBtnNext();
        
        const evisaVietnamPage = new EvisaVietnamPage(page);
        await evisaVietnamPage.aCheckPage();
        
        // Тестируем только загрузку файлов
        await evisaVietnamPage.aUploadFileImgPhoto(userData.imgPhotoFilename);
        await evisaVietnamPage.aUploadFileImgPassport(userData.imgPassportFilename);
        
        await delay(3000);
        console.log('Изображения успешно загружены!');
    });

    test('Тест заполнения только личных данных', async ({ page }) => {
        await page.goto(urlEvisa);

        const evisaVietnamAgreementPage = new EvisaVietnamAgreementPage(page);
        await evisaVietnamAgreementPage.aCheckPage();
        await evisaVietnamAgreementPage.aCheckCheckboxAgreement();
        await evisaVietnamAgreementPage.aClickBtnNext();
        
        const evisaVietnamPage = new EvisaVietnamPage(page);
        await evisaVietnamPage.aCheckPage();
        
        // Тестируем только заполнение личных данных
        await evisaVietnamPage.aFillPersonalData(userData as UserData);
        
        await delay(2000);
        console.log('Личные данные успешно заполнены!');
    });

});
