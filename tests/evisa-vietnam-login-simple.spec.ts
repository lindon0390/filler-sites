import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { EvisaVietnamLoginFlowPage, FullUserData } from '../pages/evisaVietnamLoginFlow.page';

test.describe('Vietnam E-Visa - Полный процесс с авторизацией', () => {
  let userData: FullUserData;
  let evisaPage: EvisaVietnamLoginFlowPage;

  test.beforeEach(async ({ page }) => {
    // Загружаем данные пользователя
    const userDataPath = path.join(process.cwd(), 'files/001/001.json');
    const rawData = readFileSync(userDataPath, 'utf-8');
    userData = JSON.parse(rawData);
    
    // Создаём Page Object
    evisaPage = new EvisaVietnamLoginFlowPage(page);
  });

  test('Авторизация и заполнение заявления на визу', async ({ page }) => {
    // Увеличиваем таймаут для медленного интернета
    test.setTimeout(300000); // 5 минут

    console.log('🚀 Начинаем полный процесс подачи заявления на визу...');

    // 1. Переходим на сайт
    await evisaPage.aGoToMainPage();

    // 2. Выполняем вход в систему
    await evisaPage.aLogin(
      userData.personalInformation.email,
      userData.loginCredentials.password
    );

    // 3. Начинаем подачу заявления
    await evisaPage.aStartApplication();

    // 4. Заполняем всю форму
    await evisaPage.aFillCompleteForm(userData);

    // 5. Делаем финальный скриншот
    await evisaPage.aTakeScreenshot(`filled-form-${Date.now()}.png`);

    console.log('🎉 Тест завершён! Форма заполнена и сохранён скриншот.');
  });

  test('Только авторизация (для отладки)', async ({ page }) => {
    test.setTimeout(120000); // 2 минуты

    console.log('🔐 Тестируем только процесс авторизации...');

    // Переходим на сайт
    await evisaPage.aGoToMainPage();

    // Выполняем вход
    await evisaPage.aLogin(
      userData.personalInformation.email,
      userData.loginCredentials.password
    );

    // Делаем скриншот после входа
    await evisaPage.aTakeScreenshot(`login-success-${Date.now()}.png`);

    console.log('✅ Авторизация успешна!');
  });

  test('Только заполнение формы (без авторизации)', async ({ page }) => {
    test.setTimeout(180000); // 3 минуты

    console.log('📝 Тестируем только заполнение формы...');

    // Переходим сразу к форме (предполагая, что пользователь уже авторизован)
    await page.goto('https://evisa.gov.vn/e-visa/foreigners');
    
    // Ждём полной загрузки страницы
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    
    // Принимаем условия
    await page.waitForSelector('input[type="checkbox"]', { timeout: 20000 });
    await page.check('input[type="checkbox"]:first-of-type');
    await page.check('input[type="checkbox"]:last-of-type');
    await page.click('button:has-text("Next")');

    // Ждём полной загрузки после клика Next
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Ждём загрузки формы
    await page.waitForSelector('input[id*="ttcnHo"]', { timeout: 20000 });

    // Заполняем форму
    await evisaPage.aFillCompleteForm(userData);

    // Скриншот результата
    await evisaPage.aTakeScreenshot(`form-filled-${Date.now()}.png`);

    console.log('📋 Форма заполнена!');
  });
}); 