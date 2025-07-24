import { Page, Locator } from '@playwright/test';

export class FieldUtils {
  constructor(private page: Page) {}

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
      'reEnterEmail': '1.12',
      'hasOtherPassports': '1.13',
      'otherUsedPassports': '1.14',
      'hasMultipleNationalities': '1.15'
    };
    return fieldNumbers[fieldName] || '?';
  }

  // === ТЕКСТОВЫЕ ПОЛЯ ===
  
  async fillSimpleTextField(fieldName: string, value: string, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${value}`);

    try {
      const currentValue = await locator.inputValue();
      if (currentValue === value) {
        console.log(`✅ [${fieldNumber}] Уже заполнено правильно`);
        return;
      }

      if (currentValue) {
        console.log(`🔄 [${fieldNumber}] Очищаем поле (было: "${currentValue}")`);
        await locator.clear();
      }

      await locator.fill(value);
      console.log(`✅ [${fieldNumber}] Заполнено: ${value}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ [${fieldNumber}] Ошибка: ${errorMessage}`);
      throw error;
    }
  }

  async verifySimpleTextField(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);

    try {
      const currentValue = await locator.inputValue();
      if (currentValue === expectedValue) {
        console.log(`✅ [${fieldNumber}] Проверка пройдена: ${expectedValue}`);
        return true;
      } else {
        console.log(`❌ [${fieldNumber}] Неверное значение: ожидалось "${expectedValue}", получено "${currentValue}"`);
        return false;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] Ошибка проверки: ${error}`);
      return false;
    }
  }

  // === РАДИО КНОПКИ ===
  
  async fillRadioButtonGroup(fieldName: string, expectedValue: string, radioLocators: { [key: string]: Locator }): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${expectedValue}`);

    try {
      // Проверяем состояние всех радио кнопок
      const currentStates: { [key: string]: boolean } = {};
      for (const [optionName, locator] of Object.entries(radioLocators)) {
        currentStates[optionName] = await locator.isChecked();
      }

      // Логируем текущее состояние
      const stateLog = Object.entries(currentStates)
        .map(([name, checked]) => `${name}=${checked}`)
        .join(', ');
      console.log(`🔍 [${fieldNumber}] Текущее состояние: ${stateLog}`);

      // Проверяем, уже ли выбрано нужное значение
      const expectedOption = Object.keys(radioLocators).find(key => key === expectedValue);
      if (expectedOption && currentStates[expectedOption]) {
        console.log(`✅ [${fieldNumber}] Уже выбрано правильно: ${expectedValue}`);
        return;
      }

      // Кликаем на нужную радио кнопку
      const targetLocator = radioLocators[expectedValue];
      if (targetLocator) {
        console.log(`🔄 [${fieldNumber}] Переключаем на ${expectedValue}`);
        await targetLocator.click();
        console.log(`✅ [${fieldNumber}] Выбрано: ${expectedValue}`);
      } else {
        throw new Error(`Локатор для значения "${expectedValue}" не найден`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ [${fieldNumber}] Ошибка: ${errorMessage}`);
      throw error;
    }
  }

  async verifyRadioButtonGroup(fieldName: string, expectedValue: string, radioLocators: { [key: string]: Locator }): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);

    try {
      // Проверяем состояние всех радио кнопок
      const currentStates: { [key: string]: boolean } = {};
      for (const [optionName, locator] of Object.entries(radioLocators)) {
        currentStates[optionName] = await locator.isChecked();
      }

      // Логируем текущее состояние
      const stateLog = Object.entries(currentStates)
        .map(([name, checked]) => `${name}=${checked}`)
        .join(', ');
      console.log(`🔍 [${fieldNumber}] Проверка: ${stateLog}, ожидается: ${expectedValue}`);

      // Проверяем, выбрано ли нужное значение
      const expectedOption = Object.keys(radioLocators).find(key => key === expectedValue);
      if (expectedOption && currentStates[expectedOption]) {
        console.log(`✅ [${fieldNumber}] Проверка пройдена: ${expectedValue}`);
        return true;
      } else {
        console.log(`❌ [${fieldNumber}] Неверное значение: ожидалось "${expectedValue}", выбрано: ${stateLog}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] Ошибка проверки: ${error}`);
      return false;
    }
  }
} 