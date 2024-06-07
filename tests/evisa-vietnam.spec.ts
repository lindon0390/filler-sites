import { test, expect } from '@playwright/test';
import EvisaVietnamAgreementPage from '../pages/evisaVietnamAgreement.page';
import { delay } from '../utils';
import EvisaVietnamPage from '../pages/evisaVietnam.page';

const urlEvisa = 'https://evisa.xuatnhapcanh.gov.vn/en_US/web/guest/khai-thi-thuc-dien-tu/cap-thi-thuc-dien-tu';

test.describe('Evisa Vietnam', () => {

    test('1. Click agreement', async ({ page }) => {
        await page.goto(urlEvisa);
        const evisaVietnamAgreementPage = new EvisaVietnamAgreementPage(page);

        await evisaVietnamAgreementPage.aCheckPage();

        await evisaVietnamAgreementPage.aIsNotCheckedCheckboxAgreement();
        await evisaVietnamAgreementPage.aCheckCheckboxAgreement();
        await evisaVietnamAgreementPage.aIsCheckedCheckboxAgreement();
        await evisaVietnamAgreementPage.aClickBtnNext();
        await delay();
    });

    test('2. Fill inputs', async ({ page }) => {
        const evisaVietnamPage = new EvisaVietnamPage(page);

    });



    // test('get started link', async ({ page }) => {
    //     await page.goto('https://playwright.dev/');

    //     // Click the get started link.
    //     await page.getByRole('link', { name: 'Get started' }).click();

    //     // Expects page to have a heading with the name of Installation.
    //     await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    // });
});
