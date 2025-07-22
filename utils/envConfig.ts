import { config } from 'dotenv';
import path from 'path';

// Загружаем переменные из .env файла
config({ path: path.join(process.cwd(), '.env') });

export interface EnvConfig {
  userId: string;
  authorizationNeeded: boolean;
  browserOpen: boolean;
  chromeCdpEndpoint?: string;
}

/**
 * Получаем конфигурацию из переменных окружения
 */
export function getEnvConfig(): EnvConfig {
  const userId = process.env.USER_ID || '001'; // По умолчанию 001
  const authorizationNeeded = process.env.AUTHORIZATION_NEEDED?.toLowerCase() === 'true'; // По умолчанию false
  const browserOpen = process.env.BROWSER_OPEN?.toLowerCase() === 'true'; // По умолчанию false
  const chromeCdpEndpoint = process.env.CHROME_CDP_ENDPOINT?.trim() || undefined; // WebSocket endpoint для CDP
  
  console.log(`🔧 Загружена конфигурация из .env:`);
  console.log(`   👤 USER_ID: ${userId}`);
  console.log(`   🔐 AUTHORIZATION_NEEDED: ${authorizationNeeded}`);
  console.log(`   🌐 BROWSER_OPEN: ${browserOpen}`);
  console.log(`   🔌 CHROME_CDP_ENDPOINT: ${chromeCdpEndpoint || 'автоматически'}`);
  
  return {
    userId,
    authorizationNeeded,
    browserOpen,
    chromeCdpEndpoint
  };
}

/**
 * Получаем ID пользователя из .env файла
 */
export function getUserIdFromEnv(): string {
  const config = getEnvConfig();
  return config.userId;
}

/**
 * Проверяем, нужна ли авторизация согласно .env файлу
 */
export function isAuthorizationNeeded(): boolean {
  const config = getEnvConfig();
  return config.authorizationNeeded;
}

/**
 * Проверяем, нужно ли использовать существующий браузер согласно .env файлу
 */
export function isBrowserOpenMode(): boolean {
  const config = getEnvConfig();
  return config.browserOpen;
}

/**
 * Получаем Chrome CDP endpoint из .env файла
 */
export function getChromeCdpEndpoint(): string | undefined {
  const config = getEnvConfig();
  return config.chromeCdpEndpoint;
}

/**
 * Логируем текущую конфигурацию
 */
export function logCurrentConfig(): void {
  const config = getEnvConfig();
  
  console.log('📋 Текущая конфигурация:');
  console.log(`   👤 Выбранный пользователь: ${config.userId}`);
  console.log(`   🔐 Авторизация: ${config.authorizationNeeded ? 'требуется' : 'пропускается'}`);
  console.log(`   🌐 Браузер: ${config.browserOpen ? 'подключение к существующему Chrome' : 'запуск нового браузера'}`);
  if (config.browserOpen) {
    console.log(`   🔌 CDP Endpoint: ${config.chromeCdpEndpoint || 'автоматическое определение'}`);
  }
  console.log(`   📁 Путь к данным: files/${config.userId}/${config.userId}.json`);
} 