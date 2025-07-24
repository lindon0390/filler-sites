import { Page, Locator } from '@playwright/test';
import { FieldUtils } from '../utils/fieldUtils';

export class PersonalInformationTestPage {
  readonly page: Page;
  private fieldUtils: FieldUtils;

  // Локаторы полей
  readonly eSurnameField: Locator;
  readonly eMiddleAndGivenNameField: Locator;
  readonly eDateOfBirthTypeField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fieldUtils = new FieldUtils(page);
    
    // Локаторы для полей
    this.eSurnameField = page.getByRole('textbox', { name: 'Surname (Last name)' });
    this.eMiddleAndGivenNameField = page.getByRole('textbox', { name: 'Middle and given name' });
    this.eDateOfBirthTypeField = page.getByRole('radio', { name: 'Full' });
  }

  /**
   * Ищем поле surname
   */
  async aFindSurnameField(): Promise<Locator | null> {
    const fieldNumber = this.fieldUtils.getFieldNumber('surname');
    
    try {
      const count = await this.eSurnameField.count();
      if (count > 0) {
        return this.eSurnameField;
      }
    } catch (error) {
      // Поле не найдено
    }
    
    console.log(`❌ [${fieldNumber}] Поле Surname не найдено`);
    return null;
  }

  /**
   * Ищем поле middleAndGivenName
   */
  async aFindMiddleAndGivenNameField(): Promise<Locator | null> {
    const fieldNumber = this.fieldUtils.getFieldNumber('middleAndGivenName');
    
    try {
      const count = await this.eMiddleAndGivenNameField.count();
      if (count > 0) {
        return this.eMiddleAndGivenNameField;
      }
    } catch (error) {
      // Поле не найдено
    }
    
    console.log(`❌ [${fieldNumber}] Поле Middle and given name не найдено`);
    return null;
  }
  
  /**
   * Ищем радио кнопку dateOfBirthType по значению
   */
  async aFindDateOfBirthTypeRadioByValue(value: string): Promise<Locator | null> {
    const fieldNumber = this.fieldUtils.getFieldNumber('dateOfBirthType');
    
    // Ищем радио кнопку по значению
    const radioButton = this.page.getByRole('radio', { name: value });
    
    try {
      const count = await radioButton.count();
      if (count > 0) {
        console.log(`✅ [${fieldNumber}] Найдена радио кнопка: ${value}`);
        return radioButton;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] Радио кнопка "${value}" не найдена`);
    }
    
    return null;
  }

  /**
   * Заполняем поле surname (тип 1 - простое текстовое поле)
   */
  async aFillSurnameField(surname: string): Promise<void> {
    const surnameField = await this.aFindSurnameField();
    
    if (!surnameField) {
      throw new Error('Поле Surname не найдено');
    }
    
    await this.fieldUtils.fillSimpleTextField('surname', surname, surnameField);
  }

  /**
   * Заполняем поле middleAndGivenName (тип 1 - простое текстовое поле)
   */
  async aFillMiddleAndGivenNameField(givenName: string): Promise<void> {
    const givenNameField = await this.aFindMiddleAndGivenNameField();
    
    if (!givenNameField) {
      throw new Error('Поле Middle and given name не найдено');
    }
    
    await this.fieldUtils.fillSimpleTextField('middleAndGivenName', givenName, givenNameField);
  }

  /**
   * Заполняем поле dateOfBirthType (тип 6 - радио кнопка)
   */
  async aFillDateOfBirthTypeField(dateType: string): Promise<void> {
    const dateTypeField = await this.aFindDateOfBirthTypeRadioByValue(dateType);
    
    if (!dateTypeField) {
      throw new Error(`Поле Date of birth type со значением "${dateType}" не найдено`);
    }
    
    await this.fieldUtils.fillRadioButton('dateOfBirthType', dateType, dateTypeField);
  }

  /**
   * Проверяем, что поле surname заполнено правильно
   */
  async aVerifySurnameField(expectedSurname: string): Promise<boolean> {
    const surnameField = await this.aFindSurnameField();
    
    if (!surnameField) {
      return false;
    }
    
    return await this.fieldUtils.verifySimpleTextField('surname', expectedSurname, surnameField);
  }

  /**
   * Проверяем, что поле middleAndGivenName заполнено правильно
   */
  async aVerifyMiddleAndGivenNameField(expectedGivenName: string): Promise<boolean> {
    const givenNameField = await this.aFindMiddleAndGivenNameField();
    
    if (!givenNameField) {
      return false;
    }
    
    return await this.fieldUtils.verifySimpleTextField('middleAndGivenName', expectedGivenName, givenNameField);
  }

  /**
   * Проверяем, что поле dateOfBirthType заполнено правильно
   */
  async aVerifyDateOfBirthTypeField(expectedType: string): Promise<boolean> {
    const dateTypeField = await this.aFindDateOfBirthTypeRadioByValue(expectedType);
    
    if (!dateTypeField) {
      return false;
    }
    
    return await this.fieldUtils.verifyRadioButton('dateOfBirthType', expectedType, dateTypeField);
  }

  /**
   * Проверяем, что мы на правильной странице
   */
  async aCheckEvisaPage(): Promise<void> {
    console.log('🔍 Проверяем страницу E-Visa...');
    
    // Проверяем URL
    const currentUrl = this.page.url();
    if (!currentUrl.includes('evisa.gov.vn/e-visa/foreigners')) {
      throw new Error(`❌ Неправильная страница: ${currentUrl}`);
    }
    
    console.log('✅ Страница E-Visa найдена');
  }
} 