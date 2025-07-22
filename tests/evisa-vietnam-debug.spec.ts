import { test, expect } from '@playwright/test';

test.describe('Vietnam E-Visa - Отладка селекторов', () => {
  
  test('Проверка доступности сайта и структуры страницы', async ({ page }) => {
    test.setTimeout(120000); // 2 минуты
    
    console.log('🔍 Проверяем доступность сайта Vietnam E-Visa...');
    
    // 1. Переходим на главную страницу
    await page.goto('https://evisa.gov.vn', { timeout: 20000 });
    console.log('✅ Главная страница загружена');
    
    // Делаем скриншот главной страницы
    await page.screenshot({ 
      path: `test-results/main-page-${Date.now()}.png`, 
      fullPage: true 
    });
    
    // 2. Ищем кнопку Login
    const loginButtons = [
      'text=Login',
      'a:has-text("Login")',
      'button:has-text("Login")',
      '[href*="login"]',
      '.login',
      '#login'
    ];
    
    let loginFound = false;
    for (const selector of loginButtons) {
      try {
        const element = page.locator(selector);
        await element.waitFor({ timeout: 3000 });
        console.log(`✅ Найдена кнопка Login: ${selector}`);
        await element.click();
        loginFound = true;
        break;
      } catch {
        console.log(`❌ Не найдена кнопка Login: ${selector}`);
      }
    }
    
    if (!loginFound) {
      console.log('⚠️ Кнопка Login не найдена, переходим сразу к форме');
      await page.goto('https://evisa.gov.vn/e-visa/foreigners', { timeout: 20000 });
    }
    
    // Делаем скриншот текущего состояния
    await page.screenshot({ 
      path: `test-results/after-login-click-${Date.now()}.png`, 
      fullPage: true 
    });
    
    // 3. Проверяем наличие чекбоксов на странице согласия
    console.log('🔍 Ищем чекбоксы на странице...');
    
    const checkboxSelectors = [
      'input[type="checkbox"]',
      '.ant-checkbox-input',
      '[role="checkbox"]',
      'input[id*="agreement"]',
      'input[id*="confirm"]'
    ];
    
    for (const selector of checkboxSelectors) {
      try {
        const checkboxes = page.locator(selector);
        const count = await checkboxes.count();
        if (count > 0) {
          console.log(`✅ Найдено ${count} чекбоксов: ${selector}`);
          
          // Пытаемся поставить галочки
          for (let i = 0; i < count; i++) {
            try {
              await checkboxes.nth(i).check({ timeout: 5000 });
              console.log(`✅ Чекбокс ${i + 1} отмечен`);
            } catch (error) {
              console.log(`⚠️ Не удалось отметить чекбокс ${i + 1}: ${error}`);
            }
          }
          break;
        }
      } catch {
        console.log(`❌ Чекбоксы не найдены: ${selector}`);
      }
    }
    
    // 4. Ищем кнопку Next
    console.log('🔍 Ищем кнопку Next...');
    
    const nextSelectors = [
      'button:has-text("Next")',
      'text=Next',
      'input[type="submit"]',
      '.btn-next',
      '[value="Next"]',
      'button[type="submit"]'
    ];
    
    for (const selector of nextSelectors) {
      try {
        const button = page.locator(selector);
        await button.waitFor({ timeout: 3000 });
        
        const isEnabled = await button.isEnabled();
        console.log(`✅ Найдена кнопка Next: ${selector}, активна: ${isEnabled}`);
        
        if (isEnabled) {
          await button.click();
          console.log(`✅ Кнопка Next нажата`);
          break;
        } else {
          console.log(`⚠️ Кнопка Next неактивна`);
        }
      } catch {
        console.log(`❌ Кнопка Next не найдена: ${selector}`);
      }
    }
    
    // Финальный скриншот
    await page.screenshot({ 
      path: `test-results/final-state-${Date.now()}.png`, 
      fullPage: true 
    });
    
    console.log('🎉 Отладка завершена! Проверьте скриншоты в папке test-results/');
  });
  
  test('Анализ структуры HTML страницы', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('https://evisa.gov.vn/e-visa/foreigners', { timeout: 20000 });
    
    // Получаем HTML структуру страницы
    const html = await page.content();
    
    // Анализируем наличие ключевых элементов
    const analysis = {
      hasCheckboxes: html.includes('type="checkbox"'),
      hasNextButton: html.includes('Next'),
      hasLoginForm: html.includes('login') || html.includes('Login'),
      hasAntDesign: html.includes('ant-'),
      hasForms: html.includes('<form'),
      hasInputs: html.includes('<input'),
    };
    
    console.log('📊 Анализ HTML структуры:', analysis);
    
    // Сохраняем HTML в файл для анализа
    require('fs').writeFileSync(
      `test-results/page-html-${Date.now()}.html`, 
      html
    );
    
    console.log('📄 HTML сохранён в test-results/ для анализа');
  });
}); 