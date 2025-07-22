import { expect } from '@playwright/test';
import { Locator, Page } from 'playwright';

export function newDate() { 
    return new Date().toISOString().replace(/\:/g, '-'); 
}

export function delay(time: number = 5000) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

/**
 * Форматирует дату в формат DD/MM/YYYY для вьетнамской формы
 */
export function formatDateForVietnam(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Проверяет валидность email адреса
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Форматирует номер телефона
 */
export function formatPhone(phone: string): string {
    return phone.replace(/[^\d+\-\s]/g, '');
}

/**
 * Генерирует случайный номер паспорта для тестирования
 */
export function generateTestPassportNumber(): string {
    return Math.random().toString().slice(2, 11);
}

/**
 * Ожидает видимости элемента с кастомным таймаутом
 */
export async function waitForElementVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
}

/**
 * Безопасное заполнение поля ввода с очисткой
 */
export async function safeFill(locator: Locator, text: string): Promise<void> {
    await locator.clear();
    await locator.fill(text);
}

/**
 * Логирование с временной меткой
 */
export function logWithTimestamp(message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

/**
 * Создает скриншот с уникальным именем файла
 */
export async function takeTimestampedScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = newDate();
    await page.screenshot({ path: `screenshots/${name}_${timestamp}.png` });
}

/**
 * Константы таймаутов для различных операций
 */
export const TIMEOUTS = {
    SHORT: 10000,     // 10 секунд
    MEDIUM: 20000,    // 20 секунд  
    LONG: 60000,      // 1 минута
    FILE_UPLOAD: 20000,  // 20 секунд для загрузки файлов
    PAGE_LOAD: 20000     // 20 секунд для загрузки страниц
} as const;