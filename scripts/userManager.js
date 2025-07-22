#!/usr/bin/env node

const { UserManager } = require('../utils/userManager.js');
const path = require('path');

class UserManagerCLI {
    constructor() {
        this.userManager = new UserManager();
    }

    showHelp() {
        console.log(`
🧑‍💼 Менеджер пользователей для автоматизации визы Вьетнама

Использование:
  npm run user:list              - Показать всех пользователей
  npm run user:status            - Показать статус всех пользователей  
  npm run user:switch <ID>       - Переключиться на пользователя
  npm run user:create <ID>       - Создать шаблон нового пользователя
  npm run user:check <ID>        - Проверить готовность пользователя

Примеры:
  npm run user:switch 001        - Переключиться на пользователя 001
  npm run user:create 004        - Создать шаблон для пользователя 004
  npm run user:status            - Показать статус всех пользователей
        `);
    }

    listUsers() {
        console.log('\n📋 Доступные пользователи:');
        const users = this.userManager.getAvailableUsers();
        
        if (users.length === 0) {
            console.log('❌ Пользователи с данными не найдены');
            return;
        }
        
        users.forEach(userId => {
            const ready = this.userManager.isUserReady(userId);
            const icon = ready ? '✅' : '⚠️';
            console.log(`${icon} Пользователь ${userId} ${ready ? '(готов)' : '(не готов)'}`);
        });
    }

    showStatus() {
        console.log('\n📊 Статус всех пользователей:');
        const status = this.userManager.getUsersStatus();
        
        console.log('┌─────────┬────────┬────────────┬────────────┐');
        console.log('│ ID      │ Готов  │ Данные     │ Изображения │');
        console.log('├─────────┼────────┼────────────┼────────────┤');
        
        for (const [userId, userStatus] of Object.entries(status)) {
            const readyIcon = userStatus.ready ? '✅' : '❌';
            const dataIcon = userStatus.hasData ? '✅' : '❌';
            const imageIcon = userStatus.hasImages ? '✅' : '❌';
            
            console.log(`│ ${userId}     │ ${readyIcon}     │ ${dataIcon}         │ ${imageIcon}          │`);
        }
        
        console.log('└─────────┴────────┴────────────┴────────────┘');
    }

    switchUser(userId) {
        if (!userId) {
            console.log('❌ Укажите ID пользователя');
            return;
        }

        try {
            if (!this.userManager.isUserReady(userId)) {
                console.log(`⚠️ Пользователь ${userId} не готов (отсутствуют данные или изображения)`);
                return;
            }

            this.userManager.switchToUser(userId);
            console.log(`✅ Успешно переключен на пользователя ${userId}`);
            
            // Показываем краткую информацию о пользователе
            const userData = this.userManager.loadUserData(userId);
            console.log(`👤 Имя: ${userData.name} ${userData.surname}`);
            console.log(`📧 Email: ${userData.email}`);
            
        } catch (error) {
            console.log(`❌ Ошибка: ${error.message}`);
        }
    }

    createUser(userId) {
        if (!userId) {
            console.log('❌ Укажите ID пользователя');
            return;
        }

        if (!/^\d{3}$/.test(userId)) {
            console.log('❌ ID пользователя должен быть 3-значным числом (например: 001, 002, 003)');
            return;
        }

        try {
            const template = this.userManager.createUserTemplate(userId);
            console.log(`✅ Шаблон для пользователя ${userId} создан`);
            console.log(`📁 Путь: files/${userId}/${userId}.json`);
            console.log('📝 Отредактируйте файл с данными и добавьте изображения:');
            console.log(`   - files/${userId}/${userId}-01.jpg (фотография)`);
            console.log(`   - files/${userId}/${userId}-02.jpg (паспорт)`);
            
        } catch (error) {
            console.log(`❌ Ошибка: ${error.message}`);
        }
    }

    checkUser(userId) {
        if (!userId) {
            console.log('❌ Укажите ID пользователя');
            return;
        }

        try {
            const ready = this.userManager.isUserReady(userId);
            const userData = this.userManager.loadUserData(userId);
            
            console.log(`\n👤 Пользователь ${userId}:`);
            console.log(`✅ Статус: ${ready ? 'Готов' : 'Не готов'}`);
            console.log(`📝 Имя: ${userData.name} ${userData.surname}`);
            console.log(`📧 Email: ${userData.email}`);
            console.log(`📞 Телефон: ${userData.phone}`);
            
        } catch (error) {
            console.log(`❌ Пользователь ${userId} не найден или данные повреждены`);
        }
    }

    run() {
        const args = process.argv.slice(2);
        const command = args[0];
        const param = args[1];

        switch (command) {
            case 'list':
                this.listUsers();
                break;
            case 'status':
                this.showStatus();
                break;
            case 'switch':
                this.switchUser(param);
                break;
            case 'create':
                this.createUser(param);
                break;
            case 'check':
                this.checkUser(param);
                break;
            case 'help':
            default:
                this.showHelp();
                break;
        }
    }
}

const cli = new UserManagerCLI();
cli.run(); 