import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

/**
 * Подключается к существующему Chrome браузеру
 */
export async function connectToExistingChrome(port: number = 9222): Promise<Browser> {
  console.log(`🔗 Подключаемся к Chrome на порту ${port}...`);
  
  try {
    const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
    console.log('✅ Успешно подключились к существующему Chrome');
    return browser;
  } catch (error) {
    console.error('❌ Не удалось подключиться к Chrome:', error);
    console.log('💡 Убедитесь, что Chrome запущен с параметром --remote-debugging-port=9222');
    console.log('💡 Команда: npm run chrome:debug');
    throw error;
  }
}

/**
 * Получает или создаёт новую вкладку в существующем браузере
 */
export async function getOrCreatePage(browser: Browser): Promise<Page> {
  console.log('📄 Получаем страницу из существующего браузера...');
  
  // Получаем все контексты
  const contexts = browser.contexts();
  
  if (contexts.length > 0) {
    // Используем существующий контекст
    const context = contexts[0];
    const pages = context.pages();
    
    if (pages.length > 0) {
      console.log('✅ Используем существующую вкладку');
      return pages[0];
    } else {
      console.log('📄 Создаём новую страницу в существующем контексте');
      return await context.newPage();
    }
  } else {
    // Создаём новый контекст и страницу
    console.log('📄 Создаём новый контекст и страницу');
    const context = await browser.newContext();
    return await context.newPage();
  }
}

/**
 * Полный процесс подключения к Chrome и получения страницы
 */
export async function connectAndGetPage(port: number = 9222): Promise<{ browser: Browser; page: Page }> {
  const browser = await connectToExistingChrome(port);
  const page = await getOrCreatePage(browser);
  
  console.log('🎯 Готово! Можно работать с существующим Chrome');
  return { browser, page };
}

/**
 * Проверяет, доступен ли Chrome для подключения
 */
export async function checkChromeAvailability(port: number = 9222): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${port}/json/version`);
    if (response.ok) {
      const info = await response.json();
      console.log(`✅ Chrome доступен: ${info.Browser}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Chrome недоступен на порту ${port}`);
  }
  return false;
} 