import { Page, Locator } from '@playwright/test';
import { FieldUtils } from '../utils/fieldUtils';

export class PersonalInformationTestPage {
  private fieldUtils: FieldUtils;

  // === ЛОКАТОРЫ ПОЛЕЙ ===
  // 1.1 - 1.2: Текстовые поля
  private eSurnameField: Locator;
  private eMiddleAndGivenNameField: Locator;

  // 1.3: Радио кнопки dateOfBirthType
  private eDateOfBirthFullRadio: Locator;
  private eDateOfBirthYearOnlyRadio: Locator;

  // 1.4: Поле даты рождения (пока не реализовано)
  // private eDateOfBirthField: Locator;

  // 1.5: Поле Sex (Ant Design Select)
  private eSexSelect: Locator;

  // 1.6: Поле Nationality (большой выпадающий список)
  // private eNationalitySelect: Locator;

  // 1.7: Поле Identity Card
  // private eIdentityCardField: Locator;

  // 1.8: Поле Email
  // private eEmailField: Locator;

  // 1.9: Чекбокс Agree create account
  // private eAgreeCreateAccountCheckbox: Locator;

  // 1.10: Поле Religion
  // private eReligionField: Locator;

  // 1.11: Поле Place of birth
  // private ePlaceOfBirthField: Locator;

  // 1.12: Поле Re-enter email
  // private eReEnterEmailField: Locator;

  // 1.13: Радио кнопки hasOtherPassports
  private eHasOtherPassportsNoRadio: Locator;
  private eHasOtherPassportsYesRadio: Locator;

  // 1.14: Динамическая таблица Other used passports (видна только если hasOtherPassports = "Yes")
  // private eOtherUsedPassportsTable: Locator;

  // 1.15: Радио кнопки hasMultipleNationalities
  // private eHasMultipleNationalitiesYesRadio: Locator;
  // private eHasMultipleNationalitiesNoRadio: Locator;

  // 1.16: Радио кнопки violationOfVietnameseLaws
  // private eViolationOfVietnameseLawsYesRadio: Locator;
  // private eViolationOfVietnameseLawsNoRadio: Locator;

  constructor(private page: Page) {
    this.fieldUtils = new FieldUtils(page);
    
    // Инициализация локаторов - используем специфичные селекторы
    this.eSurnameField = page.getByRole('textbox', { name: 'Surname (Last name)' });
    this.eMiddleAndGivenNameField = page.getByRole('textbox', { name: 'Middle and given name' });
    
    // Радио кнопки dateOfBirthType
    this.eDateOfBirthFullRadio = page.getByRole('radio', { name: 'Full' });
    this.eDateOfBirthYearOnlyRadio = page.getByRole('radio', { name: 'Only year is known' });
    
    // Поле Sex (Ant Design Select)
    this.eSexSelect = page.getByRole('combobox', { name: 'Sex *' });
    
    // Радио кнопки hasOtherPassports - используем специфичные локаторы
    this.eHasOtherPassportsYesRadio = page.locator('text=Have you ever used any other passports to enter into Viet Nam?').locator('..').getByRole('radio', { name: 'Yes' });
    this.eHasOtherPassportsNoRadio = page.locator('text=Have you ever used any other passports to enter into Viet Nam?').locator('..').getByRole('radio', { name: 'No' });
  }

  async aCheckEvisaPage(): Promise<void> {
    console.log('🔍 Проверяем страницу E-Visa...');
    const pageTitle = await this.page.title();
    if (pageTitle.includes('e-Visa')) {
      console.log('✅ Страница E-Visa найдена');
    } else {
      throw new Error('Страница E-Visa не найдена');
    }
  }

  // Методы для работы с текстовыми полями
  async aFindSurnameField(): Promise<Locator | null> {
    try {
      const count = await this.eSurnameField.count();
      if (count > 0) {
        console.log(`✅ [${this.fieldUtils.getFieldNumber('surname')}] Найдено поле surname`);
        return this.eSurnameField;
      }
    } catch (error) {
      console.log(`❌ [${this.fieldUtils.getFieldNumber('surname')}] Поле surname не найдено`);
    }
    return null;
  }

  async aFillSurnameField(value: string): Promise<void> {
    const field = await this.aFindSurnameField();
    if (field) {
      await this.fieldUtils.fillSimpleTextField('surname', value, field);
    }
  }

  async aVerifySurnameField(expectedValue: string): Promise<boolean> {
    const field = await this.aFindSurnameField();
    if (field) {
      return await this.fieldUtils.verifySimpleTextField('surname', expectedValue, field);
    }
    return false;
  }

  async aFindMiddleAndGivenNameField(): Promise<Locator | null> {
    try {
      const count = await this.eMiddleAndGivenNameField.count();
      if (count > 0) {
        console.log(`✅ [${this.fieldUtils.getFieldNumber('middleAndGivenName')}] Найдено поле middleAndGivenName`);
        return this.eMiddleAndGivenNameField;
      }
    } catch (error) {
      console.log(`❌ [${this.fieldUtils.getFieldNumber('middleAndGivenName')}] Поле middleAndGivenName не найдено`);
    }
    return null;
  }

  async aFillMiddleAndGivenNameField(value: string): Promise<void> {
    const field = await this.aFindMiddleAndGivenNameField();
    if (field) {
      await this.fieldUtils.fillSimpleTextField('middleAndGivenName', value, field);
    }
  }

  async aVerifyMiddleAndGivenNameField(expectedValue: string): Promise<boolean> {
    const field = await this.aFindMiddleAndGivenNameField();
    if (field) {
      return await this.fieldUtils.verifySimpleTextField('middleAndGivenName', expectedValue, field);
    }
    return false;
  }

  // Методы для работы с радио кнопками dateOfBirthType (используем общую логику с локаторами)
  async aFillDateOfBirthTypeField(dateType: string): Promise<void> {
    const radioLocators = {
      'Full': this.eDateOfBirthFullRadio,
      'Only year is known': this.eDateOfBirthYearOnlyRadio
    };
    await this.fieldUtils.fillRadioButtonGroup('dateOfBirthType', dateType, radioLocators);
  }

  async aVerifyDateOfBirthTypeField(expectedType: string): Promise<boolean> {
    const radioLocators = {
      'Full': this.eDateOfBirthFullRadio,
      'Only year is known': this.eDateOfBirthYearOnlyRadio
    };
    return await this.fieldUtils.verifyRadioButtonGroup('dateOfBirthType', expectedType, radioLocators);
  }

  // Методы для работы с радио кнопками hasOtherPassports (используем общую логику с локаторами)
  async aFillHasOtherPassportsField(value: string): Promise<void> {
    const radioLocators = {
      'Yes': this.eHasOtherPassportsYesRadio,
      'No': this.eHasOtherPassportsNoRadio
    };
    await this.fieldUtils.fillRadioButtonGroup('hasOtherPassports', value, radioLocators);
  }

  async aVerifyHasOtherPassportsField(expectedValue: string): Promise<boolean> {
    const radioLocators = {
      'Yes': this.eHasOtherPassportsYesRadio,
      'No': this.eHasOtherPassportsNoRadio
    };
    
    return await this.fieldUtils.verifyRadioButtonGroup('hasOtherPassports', expectedValue, radioLocators);
  }

  // === МЕТОДЫ ДЛЯ ПОЛЯ SEX (ТИП 2: ВЫПАДАЮЩИЙ СПИСОК) ===
  
  async aFindSexField(): Promise<Locator | null> {
    try {
      const count = await this.eSexSelect.count();
      if (count > 0) {
        console.log(`✅ [${this.fieldUtils.getFieldNumber('sex')}] Найдено поле sex`);
        return this.eSexSelect;
      }
    } catch (error) {
      console.log(`❌ [${this.fieldUtils.getFieldNumber('sex')}] Поле sex не найдено`);
    }
    return null;
  }

  async aFillSexField(value: string): Promise<void> {
    const field = await this.aFindSexField();
    if (field) {
      await this.fieldUtils.fillDropdownSelect('sex', value, field);
    } else {
      console.log(`❌ [${this.fieldUtils.getFieldNumber('sex')}] Не удалось найти поле sex для заполнения`);
    }
  }

  async aVerifySexField(expectedValue: string): Promise<boolean> {
    const field = await this.aFindSexField();
    if (field) {
      return await this.fieldUtils.verifyDropdownSelect('sex', expectedValue, field);
    } else {
      console.log(`❌ [${this.fieldUtils.getFieldNumber('sex')}] Не удалось найти поле sex для проверки`);
      return false;
    }
  }
} 