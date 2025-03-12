const ENV = require('../env/index').envSettings();
const fs = require('fs');
const { exec } = require('child_process');
const { success, failure } = require('../objects/return.objects');


const createBackup = async (targetFolder) => {
    try {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupFileName = `${targetFolder}/backup_${timestamp}.sql`;

        const backupCommand = `mysqldump -u ${ENV.DATABASE_USER} -p${ENV.DATABASE_PASSWORD} --skip-create-options ${ENV.DATABASE_NAME} > ${backupFileName}`;

        // Ensure the output directory exists
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }

        exec(backupCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Backup error:', error);
                const failureObj = failure();
                failureObj.message = "Failed to create database Backup!";
                console.log(failureObj.message);
                return;
            }

            const successObj = success();
            successObj.message = 'Database backup created!'
            console.log(successObj.message);
        });
    } catch (error) {
        console.error('Backup error:', error);
        const failureObj = failure();
        failureObj.message = "Failed to create database Backup!";
    }
}

module.exports = {
    createBackup
}