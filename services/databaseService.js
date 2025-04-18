const { createBackup } = require('../utils/dbBackup');
const { catchBlockErrorHandler } = require('../utils/errorHandler');


const createDBBackup = async () => {
    try {
        const targetFolder = 'I:\\code\\nodejs\\backups\\db\\';
        await createBackup(targetFolder);
    } catch (error) {
        catchBlockErrorHandler(error);
    }
}

module.exports = {
    createDBBackup
}