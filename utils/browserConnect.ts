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
  try {
    // Сначала проверяем, указан ли endpoint в .env
    let browserEndpoint = getChromeCdpEndpoint();
    
    if (!browserEndpoint) {
      // Получаем актуальный browser endpoint автоматически
      browserEndpoint = await getBrowserEndpoint(port);
    }
    
    // Подключаемся через WebSocket endpoint
    const browser = await chromium.connectOverCDP(browserEndpoint);
    console.log('✅ Подключились к Chrome');
    
    return browser;
  } catch (error) {
    console.error('❌ Не удалось подключиться к Chrome:', error);
    console.log('💡 Убедитесь, что Chrome запущен с параметром --remote-debugging-port=9222');
    console.log('💡 Команда: npm run chrome:debug');
    throw error;
  }
}

/**
 * Подключается к активной вкладке в существующем браузере
 */
export async function connectToActiveTab(port: number = 9222): Promise<Page> {
  try {
    // Получаем список всех вкладок через CDP API
    const response = await fetch(`http://localhost:${port}/json/list`);
    const tabs = await response.json();
    
    // Приоритетно ищем вкладку с E-Visa формой
    let activeTab = tabs.find((tab: any) => 
      tab.type === 'page' && 
      tab.url && 
      tab.url.includes('evisa.gov.vn') &&
      tab.webSocketDebuggerUrl
    );
    
    // Если E-Visa вкладка не найдена, ищем любую активную вкладку
    if (!activeTab) {
      activeTab = tabs.find((tab: any) => 
        tab.type === 'page' && 
        tab.url && 
        !tab.url.includes('chrome-devtools://') &&
        !tab.url.includes('about:blank') &&
        tab.webSocketDebuggerUrl
      );
    }
    
    if (!activeTab) {
      throw new Error('Не найдена активная вкладка для подключения');
    }
    
    // Подключаемся к браузеру в целом и ищем нужную страницу
    const browserEndpoint = await getBrowserEndpoint(port);
    const browser = await chromium.connectOverCDP(browserEndpoint);
    
    // Получаем все контексты и ищем нужную страницу
    const contexts = browser.contexts();
    
    // Собираем все страницы из всех контекстов
    const allPages = [];
    for (const context of contexts) {
      const pages = context.pages();
      allPages.push(...pages);
    }
    
    // Ищем страницы с evisa.gov.vn
    for (const page of allPages) {
      try {
        const pageUrl = page.url();
        
        if (pageUrl.includes('evisa.gov.vn')) {
          try {
            // Проверяем что страница доступна
            await page.evaluate(() => document.readyState);
            const title = await page.title();
            console.log(`✅ Подключились к странице: "${title}"`);
            return page;
          } catch (evalError) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    // Если E-Visa страница не найдена, берем любую активную страницу
    for (const page of allPages) {
      try {
        const pageUrl = page.url();
        if (!pageUrl.includes('about:blank') && !pageUrl.includes('chrome-devtools://')) {
          await page.evaluate(() => document.readyState);
          const title = await page.title();
          console.log(`✅ Подключились к странице: "${title}"`);
          return page;
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`Не удалось найти активную страницу с URL: ${activeTab.url}`);
    
  } catch (error) {
    console.error('❌ Ошибка при подключении к активной вкладке:', error);
    throw error;
  }
}

/**
 * Упрощенное подключение к активной вкладке в Chrome
 */
export async function connectAndGetActivePage(port: number = 9222): Promise<{ browser: Browser; page: Page }> {
  const page = await connectToActiveTab(port);
  
  // Получаем браузер из контекста страницы
  const browser = page.context().browser();
  if (!browser) {
    throw new Error('Не удалось получить браузер из контекста страницы');
  }
  
  return { browser, page };
}

/**
 * Полный процесс подключения к Chrome и получения страницы (устаревший)
 * @deprecated Используйте connectAndGetActivePage для подключения к активной вкладке
 */
export async function connectAndGetPage(port: number = 9222): Promise<{ browser: Browser; page: Page }> {
  console.log('⚠️ Внимание: используется устаревший метод connectAndGetPage');
  return connectAndGetActivePage(port);
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
    console.log(`❌ Chrome недоступен на порту ${port}:`, error instanceof Error ? error.message : error);
  }
  return false;
} 