import { test, expect } from '@playwright/test';
import EvisaVietnamAgreementPage from '../pages/evisaVietnamAgreement.page';
import EvisaVietnamPage, { UserData } from '../pages/evisaVietnam.page';
import { UserManager } from '../utils/userManager';
import { delay, logWithTimestamp } from '../utils';

const urlEvisa = 'https://evisa.xuatnhapcanh.gov.vn/en_US/web/guest/khai-thi-thuc-dien-tu/cap-thi-thuc-dien-tu';

test.describe('Мультипользовательские тесты', () => {
    const userManager = new UserManager();

    test.beforeAll(async () => {
        // Показываем статус всех пользователей
        const status = userManager.getUsersStatus();
        console.log('\n📊 Статус пользователей:');
        
        for (const [userId, userStatus] of Object.entries(status)) {
            const readyIcon = userStatus.ready ? '✅' : '❌';
            const dataIcon = userStatus.hasData ? '📝' : '❌';
            const imageIcon = userStatus.hasImages ? '🖼️' : '❌';
            
            console.log(`${readyIcon} Пользователь ${userId}: Данные ${dataIcon} | Изображения ${imageIcon}`);
        }
    });

    test('Тест с пользователем 001', async ({ page }) => {
        if (!userManager.isUserReady('001')) {
            test.skip('Пользователь 001 не готов (нет данных или изображений)');
        }

        logWithTimestamp('Загружаем данные пользователя 001');
        const userData = userManager.loadUserData('001');
        userManager.switchToUser('001');

        await page.goto(urlEvisa);

        // Проходим соглашение
        const agreementPage = new EvisaVietnamAgreementPage(page);
        await agreementPage.aCheckPage();
        await agreementPage.aCheckCheckboxAgreement();
        await agreementPage.aClickBtnNext();

        // Заполняем форму
        const evisaPage = new EvisaVietnamPage(page);
        await evisaPage.aCheckPage();
        
        // Загружаем изображения
        await evisaPage.aUploadFileImgPhoto(userData.imgPhotoFilename);
        await evisaPage.aUploadFileImgPassport(userData.imgPassportFilename);
        
        // Заполняем все данные
        await evisaPage.aFillAllData(userData);
        
        await delay(3000);
        logWithTimestamp('Форма для пользователя 001 успешно заполнена');
    });

    test('Переключение между пользователями', async ({ page }) => {
        const availableUsers = userManager.getAvailableUsers();
        
        if (availableUsers.length === 0) {
            test.skip('Нет доступных пользователей с данными');
        }

        logWithTimestamp(`Найдено пользователей: ${availableUsers.join(', ')}`);

        for (const userId of availableUsers.slice(0, 2)) { // Тестируем первых 2 пользователей
            if (!userManager.isUserReady(userId)) {
                logWithTimestamp(`Пропускаем пользователя ${userId} - не готов`);
                continue;
            }

            logWithTimestamp(`Тестируем пользователя ${userId}`);
            
            const userData = userManager.loadUserData(userId);
            userManager.switchToUser(userId);

            await page.goto(urlEvisa);

            const agreementPage = new EvisaVietnamAgreementPage(page);
            await agreementPage.aCheckPage();
            await agreementPage.aCheckCheckboxAgreement();
            await agreementPage.aClickBtnNext();

            const evisaPage = new EvisaVietnamPage(page);
            await evisaPage.aCheckPage();
            
            // Проверяем загрузку изображений
            await evisaPage.aUploadFileImgPhoto(userData.imgPhotoFilename);
            await evisaPage.aUploadFileImgPassport(userData.imgPassportFilename);
            
            // Заполняем только личные данные для ускорения
            await evisaPage.aFillPersonalData(userData);
            
            await delay(1000);
            logWithTimestamp(`Пользователь ${userId} протестирован успешно`);
        }
    });

    test('Создание шаблона нового пользователя', async () => {
        const newUserId = '010'; // Создаем пользователя 010 как тестовый
        
        logWithTimestamp(`Создаем шаблон для пользователя ${newUserId}`);
        const template = userManager.createUserTemplate(newUserId);
        
        expect(template.surname).toBe('ФАМИЛИЯ');
        expect(template.imgPhotoFilename).toBe('010/010-01.jpg');
        expect(template.imgPassportFilename).toBe('010/010-02.jpg');
        
        logWithTimestamp(`Шаблон для пользователя ${newUserId} создан`);
        
        // Проверяем, что файл создался
        const loadedData = userManager.loadUserData(newUserId);
        expect(loadedData.surname).toBe('ФАМИЛИЯ');
    });
}); 