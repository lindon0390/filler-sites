import { Page, Locator } from '@playwright/test';

export class FieldUtils {
  constructor(private page: Page) {}

  getFieldNumber(fieldName: string): string {
    const fieldNumbers: { [key: string]: string } = {
      // Personal Information
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
      'hasMultipleNationalities': '1.15',
      'violationOfVietnameseLaws': '1.16',
      
      // Requested Information
      'visaType': '2.1',
      'validFrom': '2.2',
      'validTo': '2.3',
      
      // Passport Information
      'passportNumber': '3.1',
      'issuingAuthority': '3.2',
      'type': '3.3',
      'dateOfIssue': '3.4',
      'expiryDate': '3.5',
      'holdOtherValidPassports': '3.6',
      'otherValidPassports': '3.7',
      
      // Contact Information
      'permanentResidentialAddress': '4.1',
      'contactAddress': '4.2',
      'telephoneNumber': '4.3',
      'emergencyContact': '4.4',
      
      // Occupation
      'occupation': '5.1',
      'occupationInfo': '5.2',
      'nameOfCompanyAgencySchool': '5.3',
      'positionCourseOfStudy': '5.4',
      'addressOfCompanyAgencySchool': '5.5',
      'companyAgencySchoolPhoneNumber': '5.6',
      
      // Trip Information
      'purposeOfEntry': '6.1',
      'intendedDateOfEntry': '6.2',
      'intendedLengthOfStay': '6.3',
      'phoneNumberInVietnam': '6.4',
      'residentialAddressInVietnam': '6.5',
      'provinceCity': '6.6',
      'wardCommune': '6.7',
      'intendedBorderGateOfEntry': '6.8',
      'intendedBorderGateOfExit': '6.9',
      'committedToDeclareTempResidence': '6.10',
      'hasAgencyOrganizationContact': '6.11',
      'beenToVietnamLastYear': '6.12',
      'vietnamVisitsLastYear': '6.13',
      'hasRelativesInVietnam': '6.14',
      'relativesInVietnam': '6.15',
      
      // Trips Expenses Insurance
      'intendedExpensesUSD': '8.1',
      'didBuyInsurance': '8.2',
      'specifyInsurance': '8.3',
      'whoCoversTripExpenses': '8.4',
      'Payment method': '8.5',
      
      // Declaration
      'agreed': '9.1'
    };
    return fieldNumbers[fieldName] || '?';
  }

  // === ТИП 1: ПРОСТОЙ ИНПУТ (simple_input) ===
  
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

  // === ТИП 2: ВЫПАДАЮЩИЙ СПИСОК (dropdown_select) ===
  
  async fillDropdownSelect(fieldName: string, expectedValue: string, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${expectedValue}`);

    try {
      // Проверяем, не заполнено ли поле уже правильно
      const isAlreadyFilled = await this.verifyDropdownSelect(fieldName, expectedValue, locator);
      if (isAlreadyFilled) {
        console.log(`✅ [${fieldNumber}] ${fieldName}: уже заполнено правильно (${expectedValue})`);
        return;
      }

      // Прокручиваем к элементу
      await locator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);

      // Кликаем на поле для открытия выпадающего списка
      await locator.click({ force: true });
      await this.page.waitForTimeout(1500);

      // Ждем появления выпадающего списка
      try {
        await this.page.locator('.ant-select-dropdown').waitFor({ timeout: 3000 });
      } catch (error) {
        console.log(`⚠️ [${fieldNumber}] ${fieldName}: выпадающий список не появился`);
      }

      let optionFound = false;

      // Поиск опции по точному тексту
      try {
        const exactOption = this.page.locator('.ant-select-item-option').filter({ hasText: expectedValue });
        if (await exactOption.count() > 0) {
          await exactOption.first().click();
          optionFound = true;
          console.log(`✅ [${fieldNumber}] ${fieldName}: установлено "${expectedValue}" (точное совпадение)`);
        }
      } catch (error) {
        console.log(`⚠️ [${fieldNumber}] ${fieldName}: не найдено точное совпадение для "${expectedValue}"`);
      }

      // Если не нашли точное совпадение, пробуем поиск по частичному совпадению
      if (!optionFound) {
        try {
          const partialOption = this.page.locator('.ant-select-item-option').filter({ hasText: new RegExp(expectedValue, 'i') });
          if (await partialOption.count() > 0) {
            await partialOption.first().click();
            optionFound = true;
            console.log(`✅ [${fieldNumber}] ${fieldName}: установлено "${expectedValue}" (частичное совпадение)`);
          }
        } catch (error) {
          console.log(`⚠️ [${fieldNumber}] ${fieldName}: не найдено частичное совпадение для "${expectedValue}"`);
        }
      }

      // Ждем закрытия выпадающего списка и обновления DOM
      if (optionFound) {
        await this.page.waitForTimeout(1000);
      } else {
        console.log(`❌ [${fieldNumber}] ${fieldName}: не удалось найти опцию "${expectedValue}" в выпадающем списке`);
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] ${fieldName}: ошибка заполнения - ${error}`);
    }
  }

  async verifyDropdownSelect(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);

    try {
      // Получаем текущее значение поля
      const currentValue = await locator.evaluate((el) => {
        // Если это input элемент, ищем родительский контейнер
        let container = el;
        if (el.classList.contains('ant-select-selection-search-input')) {
          container = el.closest('.ant-select') || el;
        }
        
        // Для Ant Design Select ищем выбранное значение в контейнере
        const selectedOption = container.querySelector('.ant-select-selection-item');
        if (selectedOption) {
          return selectedOption.textContent?.trim() || '';
        }
        
        // Альтернативный способ - через span внутри .ant-select-selection-item
        const selectedSpan = container.querySelector('.ant-select-selection-item span');
        if (selectedSpan) {
          return selectedSpan.textContent?.trim() || '';
        }
        
        // Проверяем через input для скрытых полей
        const input = container.querySelector('input');
        if (input && input.value) {
          return input.value.trim();
        }
        
        // Альтернативный способ - через placeholder
        const placeholder = container.querySelector('.ant-select-selection-placeholder');
        if (placeholder && placeholder.textContent?.includes('Choose')) {
          return '';
        }
        
        // Последний способ - через aria-label или title
        const ariaLabel = container.getAttribute('aria-label');
        if (ariaLabel && ariaLabel !== 'Choose one') {
          return ariaLabel.trim();
        }
        
        return '';
      });

      if (currentValue === expectedValue) {
        console.log(`✅ [${fieldNumber}] ${fieldName}: проверка пройдена (${expectedValue})`);
        return true;
      } else {
        console.log(`❌ [${fieldNumber}] ${fieldName}: неверное значение: ожидалось "${expectedValue}", получено "${currentValue}"`);
        return false;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] ${fieldName}: ошибка проверки - ${error}`);
      return false;
    }
  }

  // === ТИП 3: ДИНАМИЧЕСКИЙ СПИСОК С ПОИСКОМ (large_dropdown) ===
  
  async fillLargeDropdownSelect(fieldName: string, expectedValue: string, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${expectedValue}`);

    try {
      // Проверяем, не заполнено ли поле уже правильно
      const isAlreadyFilled = await this.verifyLargeDropdownSelect(fieldName, expectedValue, locator);
      if (isAlreadyFilled) {
        console.log(`✅ [${fieldNumber}] ${fieldName}: уже заполнено правильно (${expectedValue})`);
        return;
      }

      // Прокручиваем к элементу
      await locator.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(1000);

      // Кликаем на поле для открытия выпадающего списка
      await locator.click({ force: true });
      await this.page.waitForTimeout(1500);

      // Ждем появления выпадающего списка
      try {
        await this.page.locator('.ant-select-dropdown').waitFor({ timeout: 3000 });
      } catch (error) {
        console.log(`⚠️ [${fieldNumber}] ${fieldName}: выпадающий список не появился`);
      }

      let optionFound = false;

      // Способ 1: Поиск опции по точному тексту
      try {
        const exactOption = this.page.locator('.ant-select-item-option').filter({ hasText: expectedValue });
        if (await exactOption.count() > 0) {
          await exactOption.first().click();
          optionFound = true;
          console.log(`✅ [${fieldNumber}] ${fieldName}: установлено "${expectedValue}" (точное совпадение)`);
        }
      } catch (error) {
        console.log(`⚠️ [${fieldNumber}] ${fieldName}: не найдено точное совпадение для "${expectedValue}"`);
      }

      // Способ 2: Если не нашли точное совпадение, пробуем поиск по частичному совпадению
      if (!optionFound) {
        try {
          const partialOption = this.page.locator('.ant-select-item-option').filter({ hasText: new RegExp(expectedValue, 'i') });
          if (await partialOption.count() > 0) {
            await partialOption.first().click();
            optionFound = true;
            console.log(`✅ [${fieldNumber}] ${fieldName}: установлено "${expectedValue}" (частичное совпадение)`);
          }
        } catch (error) {
          console.log(`⚠️ [${fieldNumber}] ${fieldName}: не найдено частичное совпадение для "${expectedValue}"`);
        }
      }

      // Способ 3: Ввод текста в поле поиска для фильтрации списка
      if (!optionFound) {
        try {
          // Находим поле ввода в выпадающем списке
          const searchInput = this.page.locator('.ant-select-dropdown input');
          if (await searchInput.count() > 0) {
            await searchInput.fill(expectedValue);
            await this.page.waitForTimeout(1000);
            
            // Теперь ищем опцию в отфильтрованном списке
            const filteredOption = this.page.locator('.ant-select-item-option').filter({ hasText: expectedValue });
            if (await filteredOption.count() > 0) {
              await filteredOption.first().click();
              optionFound = true;
              console.log(`✅ [${fieldNumber}] ${fieldName}: установлено "${expectedValue}" (через поиск)`);
            }
          }
        } catch (error) {
          console.log(`⚠️ [${fieldNumber}] ${fieldName}: не удалось использовать поиск для "${expectedValue}"`);
        }
      }

      // Ждем закрытия выпадающего списка и обновления DOM
      if (optionFound) {
        await this.page.waitForTimeout(1000);
      } else {
        console.log(`❌ [${fieldNumber}] ${fieldName}: не удалось найти опцию "${expectedValue}" в динамическом списке`);
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] ${fieldName}: ошибка заполнения - ${error}`);
    }
  }

  async verifyLargeDropdownSelect(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);

    try {
      // Получаем текущее значение поля (аналогично типу 2)
      const currentValue = await locator.evaluate((el) => {
        // Если это input элемент, ищем родительский контейнер
        let container = el;
        if (el.classList.contains('ant-select-selection-search-input')) {
          container = el.closest('.ant-select') || el;
        }
        
        // Для Ant Design Select ищем выбранное значение в контейнере
        const selectedOption = container.querySelector('.ant-select-selection-item');
        if (selectedOption) {
          return selectedOption.textContent?.trim() || '';
        }
        
        // Альтернативный способ - через span внутри .ant-select-selection-item
        const selectedSpan = container.querySelector('.ant-select-selection-item span');
        if (selectedSpan) {
          return selectedSpan.textContent?.trim() || '';
        }
        
        // Проверяем через input для скрытых полей
        const input = container.querySelector('input');
        if (input && input.value) {
          return input.value.trim();
        }
        
        // Альтернативный способ - через placeholder
        const placeholder = container.querySelector('.ant-select-selection-placeholder');
        if (placeholder && placeholder.textContent?.includes('Choose')) {
          return '';
        }
        
        // Последний способ - через aria-label или title
        const ariaLabel = container.getAttribute('aria-label');
        if (ariaLabel && ariaLabel !== 'Choose one') {
          return ariaLabel.trim();
        }
        
        return '';
      });

      if (currentValue === expectedValue) {
        console.log(`✅ [${fieldNumber}] ${fieldName}: проверка пройдена (${expectedValue})`);
        return true;
      } else {
        console.log(`❌ [${fieldNumber}] ${fieldName}: неверное значение: ожидалось "${expectedValue}", получено "${currentValue}"`);
        return false;
      }
    } catch (error) {
      console.log(`❌ [${fieldNumber}] ${fieldName}: ошибка проверки - ${error}`);
      return false;
    }
  }

  // === ТИП 4: ЗАВИСИМЫЙ ДИНАМИЧЕСКИЙ СПИСОК С ПОИСКОМ (dependent_dropdown) ===
  
  async fillDependentDropdownSelect(fieldName: string, expectedValue: string, locator: Locator, dependsOnValue?: string): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${expectedValue} (зависит от: ${dependsOnValue})`);
    // TODO: Реализовать заполнение зависимого динамического списка с поиском (такой же как тип 3, но появляется только при установке значения в другом поле)
  }

  async verifyDependentDropdownSelect(fieldName: string, expectedValue: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);
    // TODO: Реализовать проверку зависимого динамического списка с поиском
    return false;
  }

  // === ТИП 5: ПОЛЕ ДАТЫ (date_picker) ===
  
  async fillDatePicker(fieldName: string, dateValue: string, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${dateValue}`);
    // TODO: Реализовать заполнение поля даты
  }

  async verifyDatePicker(fieldName: string, expectedDate: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);
    // TODO: Реализовать проверку поля даты
    return false;
  }

  // === ТИП 6: РАДИОКНОПКА (radio_button) ===
  
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

  // === ТИП 7: ЧЕКБОКС (checkbox) ===
  
  async fillCheckbox(fieldName: string, shouldBeChecked: boolean, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: ${shouldBeChecked ? 'checked' : 'unchecked'}`);
    // TODO: Реализовать заполнение чекбокса
  }

  async verifyCheckbox(fieldName: string, expectedState: boolean, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);
    // TODO: Реализовать проверку чекбокса
    return false;
  }

  // === ТИП 8: ЗАГРУЗКА ФАЙЛА (file_upload) ===
  
  async uploadFile(fieldName: string, filePath: string, locator: Locator): Promise<void> {
    const fieldNumber = this.getFieldNumber(fieldName);
    console.log(`📝 [${fieldNumber}] ${fieldName}: загрузка файла ${filePath}`);
    // TODO: Реализовать загрузку файла
  }

  async verifyFileUpload(fieldName: string, expectedFileName: string, locator: Locator): Promise<boolean> {
    const fieldNumber = this.getFieldNumber(fieldName);
    // TODO: Реализовать проверку загрузки файла
    return false;
  }
} 