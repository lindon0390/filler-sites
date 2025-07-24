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
    const fieldNumber = this.fieldUtils.getFieldNumber('dateOfBirthType');
    console.log(`📝 [${fieldNumber}] dateOfBirthType: ${dateType}`);
    
    try {
      // Ищем обе радио кнопки
      const fullRadio = this.page.getByRole('radio', { name: 'Full' });
      const yearOnlyRadio = this.page.getByRole('radio', { name: 'Only year is known' });
      
      // Проверяем, какая кнопка сейчас выбрана
      const isFullSelected = await fullRadio.isChecked();
      const isYearOnlySelected = await yearOnlyRadio.isChecked();
      
      console.log(`🔍 [${fieldNumber}] Текущее состояние: Full=${isFullSelected}, Only year=${isYearOnlySelected}`);
      
      if (dateType === 'Full') {
        if (isFullSelected) {
          console.log(`✅ [${fieldNumber}] Уже выбрано правильно: Full`);
          return;
        } else {
          console.log(`🔄 [${fieldNumber}] Переключаем на Full`);
          await fullRadio.click();
        }
      } else if (dateType === 'Only year is known') {
        if (isYearOnlySelected) {
          console.log(`✅ [${fieldNumber}] Уже выбрано правильно: Only year is known`);
          return;
        } else {
          console.log(`🔄 [${fieldNumber}] Переключаем на Only year is known`);
          await yearOnlyRadio.click();
        }
      }
      
      console.log(`✅ [${fieldNumber}] Выбрано: ${dateType}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ [${fieldNumber}] Ошибка: ${errorMessage}`);
      throw error;
    }
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
    const fieldNumber = this.fieldUtils.getFieldNumber('dateOfBirthType');
    
    try {
      // Ищем обе радио кнопки
      const fullRadio = this.page.getByRole('radio', { name: 'Full' });
      const yearOnlyRadio = this.page.getByRole('radio', { name: 'Only year is known' });
      
      // Проверяем, какая кнопка выбрана
      const isFullSelected = await fullRadio.isChecked();
      const isYearOnlySelected = await yearOnlyRadio.isChecked();
      
      console.log(`🔍 [${fieldNumber}] Проверка: Full=${isFullSelected}, Only year=${isYearOnlySelected}, ожидается: ${expectedType}`);
      
      if (expectedType === 'Full' && isFullSelected) {
        console.log(`✅ [${fieldNumber}] Проверка пройдена: Full`);
        return true;
      } else if (expectedType === 'Only year is known' && isYearOnlySelected) {
        console.log(`✅ [${fieldNumber}] Проверка пройдена: Only year is known`);
        return true;
      } else {
        console.log(`❌ [${fieldNumber}] Неверное значение: ожидалось "${expectedType}", выбрано: Full=${isFullSelected}, Only year=${isYearOnlySelected}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] Ошибка проверки: ${error}`);
      return false;
    }
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