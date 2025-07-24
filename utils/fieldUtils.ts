import { Locator, Page } from '@playwright/test';

export interface FieldUtils {
  page: Page;
}

export class FieldUtils {
  constructor(private page: Page) {}

  /**
   * Получить номер поля из классификации
   */
  getFieldNumber(fieldName: string): string {
    const fieldNumbers: { [key: string]: string } = {
      'surname': '1.1',
      'middleAndGivenName': '1.2',
      'dateOfBirthType': '1.3',
      'dateOfBirth': '1.4',
      'sex': '1.5',
      'nationality': '1.6',
      'identityCard': '1.7',
      'email': '1.8',
      'agreeCreateAccount': '1.9',
      'religion': '1.10',
      'placeOfBirth': '1.11',
      'reEnterEmail': '1.12'
    };
    return fieldNumbers[fieldName] || '?';
  }

  /**
   * Заполнить простое текстовое поле
   */
  async fillSimpleTextField(fieldName: string, value: string, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${value}`);
    
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      const beforeValue = await locator.inputValue();
      
      if (beforeValue === value) {
        console.log(`✅ [${fieldNumber}] Уже заполнено правильно`);
        return;
      }
      
      if (beforeValue !== '') {
        console.log(`⚠️ [${fieldNumber}] Содержит: "${beforeValue}" → очищаем`);
        await locator.clear();
      }
      
      await locator.fill(value);
      const afterFillValue = await locator.inputValue();
      
      if (afterFillValue === value) {
        console.log(`✅ [${fieldNumber}] Заполнено: ${value}`);
      } else {
        console.log(`❌ [${fieldNumber}] Ошибка: ожидалось "${value}", получено "${afterFillValue}"`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ [${fieldNumber}] Ошибка: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Заполнить радио кнопку
   */
  async fillRadioButton(fieldName: string, value: string, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${value}`);
    
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      const beforeValue = await locator.isChecked();
      
      if (beforeValue && value === 'Full') {
        console.log(`✅ [${fieldNumber}] Уже выбрано правильно`);
        return;
      }
      
      if (!beforeValue && value === 'Only year is known') {
        console.log(`✅ [${fieldNumber}] Уже выбрано правильно`);
        return;
      }
      
      await locator.click();
      console.log(`✅ [${fieldNumber}] Выбрано: ${value}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ [${fieldNumber}] Ошибка: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Проверить простое текстовое поле
   */
  async verifySimpleTextField(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);
    
    try {
      const actualValue = await locator.inputValue();
      
      if (actualValue === expectedValue) {
        console.log(`✅ [${fieldNumber}] Проверка пройдена: ${expectedValue}`);
        return true;
      } else {
        console.log(`❌ [${fieldNumber}] Неверное значение: "${actualValue}" (ожидалось "${expectedValue}")`);
        return false;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] Ошибка проверки: ${error}`);
      return false;
    }
  }

  /**
   * Проверить радио кнопку
   */
  async verifyRadioButton(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);
    
    try {
      const isChecked = await locator.isChecked();
      
      if (isChecked) {
        console.log(`✅ [${fieldNumber}] Проверка пройдена: ${expectedValue}`);
        return true;
      } else {
        console.log(`❌ [${fieldNumber}] Неверное значение: радио кнопка "${expectedValue}" не выбрана`);
        return false;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] Ошибка проверки: ${error}`);
      return false;
    }
  }
} 