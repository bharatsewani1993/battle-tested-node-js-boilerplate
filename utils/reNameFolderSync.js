const fs = require('fs');
const path = require('path');

const reNameFolderSync = async (source, destination) => {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    if (fs.existsSync(source)) {
        const entries = fs.readdirSync(source, { withFileTypes: true });

        for (const entry of entries) {
            const sourcePath = path.join(source, entry.name);
            const destinationPath = path.join(destination, entry.name);

            if (entry.isDirectory()) {
                reNameFolderSync(sourcePath, destinationPath);
            } else {
                fs.copyFileSync(sourcePath, destinationPath);
            }
        }
    }
}

module.exports = {
    reNameFolderSync
}