const fs = require('fs');
const path = require('path');

class UserManager {
    constructor() {
        this.filesDir = path.join(__dirname, '../files');
    }

    /**
     * Получает список доступных пользователей
     */
    getAvailableUsers() {
        const users = [];
        const entries = fs.readdirSync(this.filesDir, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory() && /^\d{3}$/.test(entry.name)) {
                const userDir = path.join(this.filesDir, entry.name);
                const jsonFile = path.join(userDir, `${entry.name}.json`);
                
                // Проверяем, есть ли JSON файл с данными
                if (fs.existsSync(jsonFile)) {
                    users.push(entry.name);
                }
            }
        }
        
        return users.sort();
    }

    /**
     * Загружает данные конкретного пользователя
     */
    loadUserData(userId) {
        const userDir = path.join(this.filesDir, userId);
        const jsonFile = path.join(userDir, `${userId}.json`);
        
        if (!fs.existsSync(jsonFile)) {
            throw new Error(`Данные пользователя ${userId} не найдены`);
        }
        
        const jsonContent = fs.readFileSync(jsonFile, 'utf-8');
        const userData = JSON.parse(jsonContent);
        
        // Добавляем правильные пути к изображениям
        userData.imgPhotoFilename = `${userId}/${userId}-01.jpg`;
        userData.imgPassportFilename = `${userId}/${userId}-02.jpg`;
        
        return userData;
    }

    /**
     * Сохраняет данные пользователя
     */
    saveUserData(userId, userData) {
        const userDir = path.join(this.filesDir, userId);
        const jsonFile = path.join(userDir, `${userId}.json`);
        
        // Создаем папку если её нет
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        
        // Сохраняем только данные без путей к файлам
        const { imgPhotoFilename, imgPassportFilename, ...dataToSave } = userData;
        
        fs.writeFileSync(jsonFile, JSON.stringify(dataToSave, null, 4), 'utf-8');
    }

    /**
     * Создает шаблон для нового пользователя
     */
    createUserTemplate(userId) {
        const template = {
            surname: "ФАМИЛИЯ",
            name: "ИМЯ ОТЧЕСТВО",
            birthDate: "DD/MM/YYYY",
            gender: "male",
            birthPlace: "МЕСТО РОЖДЕНИЯ",
            nationality: "RU",
            
            passportNumber: "000000000",
            passportIssueDate: "DD/MM/YYYY",
            passportExpiryDate: "DD/MM/YYYY",
            passportIssuePlace: "МЕСТО ВЫДАЧИ",
            
            email: "email@example.com",
            phone: "+7-XXX-XXX-XX-XX",
            address: "АДРЕС ПРОЖИВАНИЯ",
            
            entryDate: "DD/MM/YYYY",
            exitDate: "DD/MM/YYYY",
            purpose: "Tourism",
            
            imgPhotoFilename: `${userId}/${userId}-01.jpg`,
            imgPassportFilename: `${userId}/${userId}-02.jpg`
        };
        
        this.saveUserData(userId, template);
        return template;
    }

    /**
     * Переключает активного пользователя (копирует файлы в корень)
     */
    switchToUser(userId) {
        const userData = this.loadUserData(userId);
        const userDir = path.join(this.filesDir, userId);
        
        // Копируем изображения в корень папки files
        const photoSrc = path.join(userDir, `${userId}-01.jpg`);
        const passportSrc = path.join(userDir, `${userId}-02.jpg`);
        const photoDest = path.join(this.filesDir, 'imgPhoto.jpg');
        const passportDest = path.join(this.filesDir, 'imgPassport.jpg');
        
        if (fs.existsSync(photoSrc)) {
            fs.copyFileSync(photoSrc, photoDest);
        }
        
        if (fs.existsSync(passportSrc)) {
            fs.copyFileSync(passportSrc, passportDest);
        }
        
        // Обновляем userData.json
        const userDataForRoot = { ...userData };
        userDataForRoot.imgPhotoFilename = 'imgPhoto.jpg';
        userDataForRoot.imgPassportFilename = 'imgPassport.jpg';
        
        const userDataPath = path.join(__dirname, '../userData.json');
        fs.writeFileSync(userDataPath, JSON.stringify(userDataForRoot, null, 4), 'utf-8');
        
        console.log(`✅ Переключен на пользователя ${userId}`);
    }

    /**
     * Проверяет готовность данных пользователя
     */
    isUserReady(userId) {
        const userDir = path.join(this.filesDir, userId);
        const jsonFile = path.join(userDir, `${userId}.json`);
        const photoFile = path.join(userDir, `${userId}-01.jpg`);
        const passportFile = path.join(userDir, `${userId}-02.jpg`);
        
        return fs.existsSync(jsonFile) && 
               fs.existsSync(photoFile) && 
               fs.existsSync(passportFile);
    }

    /**
     * Получает статус всех пользователей
     */
    getUsersStatus() {
        const status = {};
        
        // Проверяем папки от 001 до 010
        for (let i = 1; i <= 10; i++) {
            const userId = i.toString().padStart(3, '0');
            const userDir = path.join(this.filesDir, userId);
            
            if (fs.existsSync(userDir)) {
                const hasData = fs.existsSync(path.join(userDir, `${userId}.json`));
                const hasPhoto = fs.existsSync(path.join(userDir, `${userId}-01.jpg`));
                const hasPassport = fs.existsSync(path.join(userDir, `${userId}-02.jpg`));
                const hasImages = hasPhoto && hasPassport;
                
                status[userId] = {
                    ready: hasData && hasImages,
                    hasData,
                    hasImages
                };
            }
        }
        
        return status;
    }
}

module.exports = { UserManager }; 