#!/usr/bin/env node

/**
 * Скрипт для работы с Chrome DevTools Protocol
 * Позволяет проверить статус Chrome и получить актуальный endpoint
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function checkChromeStatus(port = 9222) {
  try {
    console.log(`🔍 Проверяем статус Chrome на порту ${port}...`);
    
    // Проверяем версию и browser endpoint
    const response = await fetch(`http://localhost:${port}/json/version`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const info = await response.json();
    
    console.log('✅ Chrome доступен для подключения!');
    console.log(`📋 Информация о браузере:`);
    console.log(`   🌐 Версия: ${info.Browser}`);
    console.log(`   🔧 User-Agent: ${info['User-Agent']}`);
    console.log(`   🔌 WebSocket Endpoint: ${info.webSocketDebuggerUrl}`);
    
    // Получаем список вкладок
    const tabsResponse = await fetch(`http://localhost:${port}/json/list`);
    const tabs = await tabsResponse.json();
    const pages = tabs.filter(tab => tab.type === 'page');
    
    console.log(`\n📄 Открытые вкладки (${pages.length}):`);
    pages.forEach((tab, index) => {
      console.log(`   ${index + 1}. ${tab.title}`);
      console.log(`      URL: ${tab.url}`);
      console.log(`      ID: ${tab.id}`);
    });
    
    // Показываем команду для .env
    console.log(`\n💡 Для использования в .env добавьте:`);
    console.log(`CHROME_CDP_ENDPOINT=${info.webSocketDebuggerUrl}`);
    
    return info.webSocketDebuggerUrl;
  } catch (error) {
    console.error('❌ Chrome недоступен:', error.message);
    console.log('\n💡 Возможные решения:');
    console.log('   1. Запустите Chrome с отладочным портом:');
    console.log('      npm run chrome:debug');
    console.log('   2. Или вручную:');
    console.log('      killall "Google Chrome"');
    console.log('      /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \\');
    console.log('        --remote-debugging-port=9222 \\');
    console.log('        --user-data-dir=/tmp/chrome-debug-profile \\');
    console.log('        --disable-web-security \\');
    console.log('        --disable-features=VizDisplayCompositor');
    console.log('   3. Проверьте, не занят ли порт:');
    console.log(`      lsof -i :${port}`);
    
    return null;
  }
}

async function killChrome() {
  try {
    console.log('🔄 Завершаем все процессы Chrome...');
    
    if (process.platform === 'darwin') {
      await execAsync('killall "Google Chrome" 2>/dev/null || true');
    } else if (process.platform === 'win32') {
      await execAsync('taskkill /f /im chrome.exe 2>nul || exit 0');
    } else {
      await execAsync('pkill chrome 2>/dev/null || true');
    }
    
    console.log('✅ Chrome процессы завершены');
  } catch (error) {
    console.log('⚠️ Не удалось завершить Chrome:', error.message);
  }
}

async function startChromeDebug(port = 9222) {
  try {
    console.log(`🚀 Запускаем Chrome с отладочным портом ${port}...`);
    
    await killChrome();
    
    // Небольшая пауза после завершения процессов
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let command;
    if (process.platform === 'darwin') {
      command = `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome \
--remote-debugging-port=${port} \
--user-data-dir=/tmp/chrome-debug-profile \
--disable-web-security \
--disable-features=VizDisplayCompositor &`;
    } else if (process.platform === 'win32') {
      command = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" ^
--remote-debugging-port=${port} ^
--user-data-dir=C:\\temp\\chrome-debug-profile ^
--disable-web-security ^
--disable-features=VizDisplayCompositor`;
    } else {
      command = `google-chrome \
--remote-debugging-port=${port} \
--user-data-dir=/tmp/chrome-debug-profile \
--disable-web-security \
--disable-features=VizDisplayCompositor &`;
    }
    
    exec(command, (error) => {
      if (error) {
        console.error('❌ Ошибка запуска Chrome:', error.message);
        return;
      }
    });
    
    // Ждём запуска Chrome
    console.log('⏳ Ожидание запуска Chrome...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Проверяем статус
    await checkChromeStatus(port);
    
  } catch (error) {
    console.error('❌ Ошибка запуска Chrome:', error.message);
  }
}

async function main() {
  const command = process.argv[2];
  const port = parseInt(process.argv[3]) || 9222;
  
  switch (command) {
    case 'status':
    case 'check':
      await checkChromeStatus(port);
      break;
      
    case 'start':
    case 'launch':
      await startChromeDebug(port);
      break;
      
    case 'stop':
    case 'kill':
      await killChrome();
      break;
      
    case 'restart':
      await killChrome();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await startChromeDebug(port);
      break;
      
    default:
      console.log('🛠️ Chrome Debug Helper');
      console.log('');
      console.log('Использование:');
      console.log('  node scripts/chromeDebug.js <command> [port]');
      console.log('');
      console.log('Команды:');
      console.log('  status    - Проверить статус Chrome и показать endpoint');
      console.log('  start     - Запустить Chrome с отладочным портом');
      console.log('  stop      - Завершить все процессы Chrome');
      console.log('  restart   - Перезапустить Chrome');
      console.log('');
      console.log('Примеры:');
      console.log('  node scripts/chromeDebug.js status');
      console.log('  node scripts/chromeDebug.js start 9222');
      console.log('  node scripts/chromeDebug.js restart');
      break;
  }
}

// Запуск скрипта
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkChromeStatus,
  killChrome,
  startChromeDebug
}; 