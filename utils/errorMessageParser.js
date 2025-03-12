const ENV = require('../env/index').envSettings();

const errorMessageParser = async (error) => {

    const stackLines = error.stack.split('\n');
    const stackLine = stackLines[1] || '';
    const matchResult = stackLine.match(/at\s+(.*):(\d+):(\d+)/);

    if (matchResult) {
        const [, fileName, lineNumber, columnNumber] = matchResult;

        let consoleMessage = `\nCatch Block Error occured on ${ENV.STAGE} server.\n` +
            `Error occurred in file: ${fileName}\n` +
            `Line number: ${lineNumber}\n` +
            `Column number: ${columnNumber}\n` +
            `Error Message is: ${error.message}\n`;

        console.log(consoleMessage);

        return true;
    } else {

        const consoleMessage = `\nCritical Error occured on ${ENV.STAGE} server.` +
            `Error occurred in ${error.stack}\n`;

        console.log(consoleMessage);
        return true;
    }

}

module.exports = {
    errorMessageParser
}