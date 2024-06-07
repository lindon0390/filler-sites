import { expect } from '@playwright/test';
import { Locator, Page } from 'playwright';

export function newDate() { return new Date().toISOString().replace(/\:/g, '-') }

export function delay(time: number = 5000) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}