const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const { success, failure } = require('../objects/return.objects');

const createZip = async (sourceDirectory, outputDirectory) => {
    try {
        const targetFile = Date.now().toString();

        // Output ZIP file path
        const outputZipPath = path.join(outputDirectory, `${targetFile}.zip`);

        // Ensure the output directory exists
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, { recursive: true });
        }

        // Create a write stream to the output ZIP file
        const output = fs.createWriteStream(outputZipPath);

        // Create a new archiver instance
        const archive = archiver('zip', {
            zlib: { level: 5 } // Set compression level (optional)
        });

        // Listen for errors on the archive
        archive.on('error', err => {
            throw err;
        });

        // Pipe the output stream to the archive
        archive.pipe(output);

        // Add the contents of the source directory to the archive
        archive.directory(sourceDirectory, false);

        // Finalize the archive
        archive.finalize();

        // Inform when the archive is created
        output.on('close', () => {
            console.log(`Archive created: ${archive.pointer() / (1024 * 1024)} MB`);
        });

    } catch (error) {
        console.log(error);
        const failureObj = failure();
        return failureObj;
    }
}

module.exports = {
    createZip
}