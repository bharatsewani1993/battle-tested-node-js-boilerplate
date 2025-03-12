const ENV = require('../../env/index').envSettings();
const criticalServerErrorTemplate = (error) => {

    const stackLines = error.stack.split('\n');
    const stackLine = stackLines[1] || '';
    const matchResult = stackLine.match(/at\s+(.*):(\d+):(\d+)/);

    if (matchResult) {
        const [, fileName, lineNumber, columnNumber] = matchResult;

        return `<html><body>
          <p><a href="#">Critical Error occured on ${ENV.STAGE} server. <br>
          Error occurred in file: ${fileName} <br> Line number:${lineNumber} <br> Column number: ${columnNumber} <br>
          <br>
          Error Message is: ${error.message}
          </body></html > `
    } else {
        return `<html><body>
        <p><a href="#">Critical Error occured on ${ENV.STAGE} server. <br>
        Error occurred in ${error.stack}
        </body></html > `
    }
}

module.exports = {
    criticalServerErrorTemplate
}