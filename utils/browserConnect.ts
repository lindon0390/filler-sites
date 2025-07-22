import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { getChromeCdpEndpoint } from './envConfig';

/**
 * Получает актуальный browser endpoint из Chrome DevTools API
 */
async function getBrowserEndpoint(port: number = 9222): Promise<string> {
  try {
    const response = await fetch(`http://localhost:${port}/json/version`);
    if (response.ok) {
      const info = await response.json();
      return info.webSocketDebuggerUrl;
    }
  } catch (error) {
    console.error('❌ Ошибка получения browser endpoint:', error);
  }
  throw new Error(`Не удалось получить browser endpoint с порта ${port}`);
}

/**
 * Получает список активных вкладок из Chrome
 */
async function getActiveTabs(port: number = 9222): Promise<any[]> {
  try {
    const response = await fetch(`http://localhost:${port}/json/list`);
    if (response.ok) {
      const tabs = await response.json();
      // Фильтруем только обычные страницы (не service workers)
      return tabs.filter((tab: any) => tab.type === 'page');
    }
  } catch (error) {
    console.error('❌ Ошибка получения списка вкладок:', error);
  }
  return [];
}

/**
 * Подключается к существующему Chrome браузеру
 */
export async function connectToExistingChrome(port: number = 9222): Promise<Browser> {
  console.log(`🔗 Подключаемся к Chrome на порту ${port}...`);
  
  try {
    // Сначала проверяем, указан ли endpoint в .env
    let browserEndpoint = getChromeCdpEndpoint();
    
    if (browserEndpoint) {
      console.log(`🔧 Используем endpoint из .env: ${browserEndpoint}`);
    } else {
      // Получаем актуальный browser endpoint автоматически
      browserEndpoint = await getBrowserEndpoint(port);
      console.log(`🔍 Автоматически определён endpoint: ${browserEndpoint}`);
    }
    
    // Подключаемся через WebSocket endpoint
    const browser = await chromium.connectOverCDP(browserEndpoint);
    console.log('✅ Успешно подключились к существующему Chrome');
    
    // Показываем информацию о доступных вкладках
    const tabs = await getActiveTabs(port);
    console.log(`📋 Найдено вкладок: ${tabs.length}`);
    tabs.forEach((tab, index) => {
      console.log(`  ${index + 1}. ${tab.title} - ${tab.url}`);
    });
    
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
  
  try {
    // Получаем все контексты
    const contexts = browser.contexts();
    console.log(`🔍 Найдено контекстов: ${contexts.length}`);
    
    if (contexts.length > 0) {
      // Ищем контекст с активными страницами
      for (const context of contexts) {
        const pages = context.pages();
        console.log(`📄 Страниц в контексте: ${pages.length}`);
        
        if (pages.length > 0) {
          // Используем первую доступную страницу
          const page = pages[0];
          console.log(`✅ Используем существующую вкладку: ${await page.title()}`);
          
          // Проверяем, что страница активна
          try {
            await page.evaluate(() => document.readyState);
            return page;
          } catch (error) {
            console.log('⚠️ Страница неактивна, создаём новую');
          }
        }
      }
      
      // Если не нашли активные страницы, создаём новую в первом контексте
      console.log('📄 Создаём новую страницу в существующем контексте');
      return await contexts[0].newPage();
    } else {
      // Создаём новый контекст и страницу
      console.log('📄 Создаём новый контекст и страницу');
      const context = await browser.newContext({
        // Отключаем автоматическое закрытие контекста
        // чтобы сохранить сессию в существующем браузере
      });
      return await context.newPage();
    }
  } catch (error) {
    console.error('❌ Ошибка при работе со страницами:', error);
    
    // Fallback: создаём новый контекст
    console.log('🔄 Создаём новый контекст в качестве fallback');
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
      
      // Дополнительно проверяем доступность вкладок
      const tabs = await getActiveTabs(port);
      console.log(`📋 Доступно вкладок: ${tabs.length}`);
      
      return true;
    }
  } catch (error) {
    console.log(`❌ Chrome недоступен на порту ${port}:`, error.message);
  }
  return false;
} 