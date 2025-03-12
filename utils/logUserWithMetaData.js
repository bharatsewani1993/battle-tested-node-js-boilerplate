const fs = require("fs");
const path = require("path");

// Function to extract client metadata from the request object
const extractClientMetaData = (req) => {
    const clientIp = req.clientIp;
    const userAgent = req.headers['user-agent'];
    const requestUrl = req.url;
    const requestMethod = req.method;
    const requestHeader = req.headers;

    return {
        clientIp: clientIp,
        userAgent: userAgent,
        requestUrl: requestUrl,
        requestMethod: requestMethod,
        requestHeader: requestHeader,
        referer: req.headers.referer, // Referrer header
        timestamp: new Date().toISOString() // Timestamp
    };
};

// Function to log prompt details along with metadata
const logPromptDetails = async (metadata) => {
    try {
        // Get current date to use in the file name
        const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
        const fileName = `prompt_Logs_${currentDate}.json`;

        // Construct the folder path
        const folderPath = path.join(__dirname, '..', 'logs');

        // Create the folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Construct the file path inside the 'Logs' folder
        const filePath = path.join(folderPath, fileName);

    

        // Convert metadata to JSON string
        const newData = JSON.stringify(metadata, null, 4);

        // Check if file exists, if not create a new one with an empty array
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
        }

        // Append data to JSON file
        fs.appendFileSync(filePath, newData + ',\n'); // Add newline for readability

        console.log(`Data appended to ${fileName} in 'Logs' folder successfully.`);
    } catch (error) {
        console.error("Error occurred while storing data:", error);
    }
};

module.exports = {
    logPromptDetails,
    extractClientMetaData
};
