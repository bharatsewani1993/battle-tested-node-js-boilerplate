const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ENV = require('../env/index').envSettings();
const os = require('os');
const homeDirectory = os.homedir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the folder where the ZIP file will be saved
        if (!fs.existsSync(homeDirectory + ENV.ZIP_UPLOAD_FOLDER)) {
            fs.mkdirSync(homeDirectory + ENV.ZIP_UPLOAD_FOLDER);
        }
        cb(null, homeDirectory + ENV.ZIP_UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {

    const allowedExtensions = ['.rar', '.zip'];
    const isValidExtension = allowedExtensions.includes(
        file.originalname.toLowerCase().match(/\.[a-z0-9]+$/)[0]
    );

    if (!isValidExtension) {
        const error = new Error('Only .zip and .rar files are allowed to upload!');
        error.status = 400;
        cb(error, false);
    }

    cb(null, true);
};

module.exports = {
    storage,
    fileFilter
}

