const fs = require('fs');
const path = require('path');

const deleteFolderSync = async (folderPath) => {
    if (fs.existsSync(folderPath)) {
        const entries = fs.readdirSync(folderPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = path.join(folderPath, entry.name);

            if (entry.isDirectory()) {
                deleteFolderSync(entryPath);
            } else {
                fs.unlinkSync(entryPath);
            }
        }

        fs.rmdirSync(folderPath);
    }
}

module.exports = {
    deleteFolderSync
};