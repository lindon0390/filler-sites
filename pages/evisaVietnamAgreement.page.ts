import { expect, Locator, Page } from '@playwright/test';

export default class EvisaVietnamAgreementPage {
    readonly page: Page;

    readonly eCheckboxAgreement: Locator;
    readonly eBtnNext: Locator;


    // readonly eInputLIEmail: Locator;
    // readonly eInputLIPassword: Locator;
    // readonly eBtnContinue: Locator;
    // readonly eBtnSetUpAProxy: Locator;
    // readonly eBtnTurnedVPN: Locator;
    // readonly eInputProxyIPHost: Locator;
    // readonly eInputProxyPort: Locator;
    // readonly eInputProxyLogin: Locator;
    // readonly eInputProxyPassword: Locator;
    // readonly eInputProxyName: Locator;
    // readonly eImgLoader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.eCheckboxAgreement = page.getByRole('checkbox', { name: 'Confirmation of reading carefully instructions and having completed application' });
        this.eBtnNext = page.getByRole('button', { name: 'Next' });

        // this.eInputLIEmail = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]//input[@placeholder="Email"]');
        // this.eInputLIPassword = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]//input[@placeholder="Password"]'); 
        // this.eBtnContinue = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]//span[text()="Continue"]');
        // this.eBtnSetUpAProxy = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]//a[text()="Set up a proxy"]');
        // this.eBtnTurnedVPN = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]//span[text()="I turned on VPN"]');
        // this.eInputProxyIPHost = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]/div[contains(@class, "Form_Form")]/div[2]//input');
        // this.eInputProxyPort = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]/div[contains(@class, "Form_Form")]/div[3]//input');
        // this.eInputProxyLogin = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]/div[contains(@class, "Form_Form")]/div[5]//input');
        // this.eInputProxyPassword = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]/div[contains(@class, "Form_Form")]/div[6]//input');
        // this.eInputProxyName = page.locator('//div[contains(@class, "OnBoarding_OnBoarding")]/div[contains(@class, "Form_Form")]/div[7]//input');
        // this.eImgLoader = page.locator('//div[contains(@class, "Logo")]/img[contains(@class, "Spinner")]');
    }

    async aCheckPage() {
        await expect(this.eCheckboxAgreement).toBeVisible({ timeout: 20000 });
        await expect(this.eBtnNext).toBeVisible({ timeout: 20000 });
    }

    async aCheckCheckboxAgreement() {
        await this.eCheckboxAgreement.check();
    }

    async aIsCheckedCheckboxAgreement() {
        await expect(this.eCheckboxAgreement).toBeChecked();
    }

    async aIsNotCheckedCheckboxAgreement() {
        await expect(this.eCheckboxAgreement).not.toBeChecked();
    }


    async aClickBtnNext() {
        await this.eBtnNext.click();
    }

    async aGoToEvisaPage() {
        await this.page.goto('https://evisa.gov.vn/e-visa/foreigners', { timeout: 20000 });
        
        // Ждём полной загрузки страницы
        await this.page.waitForLoadState('networkidle', { timeout: 20000 });
        
        console.log('✅ Страница e-visa загружена');
    }

    async aAcceptAgreement() {
        await this.aCheckPage();
        await this.aCheckCheckboxAgreement();
        
        // Проверяем, есть ли второй чекбокс
        const secondCheckbox = this.page.getByRole('checkbox').nth(1);
        try {
            await secondCheckbox.waitFor({ timeout: 20000 });
            await secondCheckbox.check();
        } catch {
            // Если второго чекбокса нет, продолжаем
        }
        
        await this.aClickBtnNext();
        
        // Ждём загрузки следующей страницы
        await this.page.waitForLoadState('networkidle', { timeout: 20000 });
        
        console.log('✅ Соглашение принято, переходим к форме');
    }

    // async aFillInputLIEmail(text: string) {
    //     await this.eInputLIEmail.fill(text);
    // }

    // async aFillInputLIPassword(text: string) {
    //     await this.eInputLIPassword.fill(text);
    // }

    // async aClickBtnContinue() {
    //     await this.eBtnContinue.click();
    // }

    // async aClickBtnSetUpAProxy() {
    //     await this.eBtnSetUpAProxy.click();
    // }

    // async aClickBtnTurnedVPN() {
    //     await this.eBtnTurnedVPN.click();
    // }

    // async aFillInputProxyIP(text: string) {
    //     await this.eInputProxyIPHost.fill(text);
    // }

    // async aFillInputProxyPort(text: string) {
    //     await this.eInputProxyPort.fill(text);
    // }

    // async aFillInputProxyLogin(text: string) {
    //     await this.eInputProxyLogin.fill(text);
    // }

    // async aFillInputProxyPassword(text: string) {
    //     await this.eInputProxyPassword.fill(text);
    // }

    // async aFillInputProxyName(text: string) {
    //     await this.eInputProxyName.fill(text);
    // }
}