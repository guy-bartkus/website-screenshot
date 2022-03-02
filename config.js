const {join} = require('path');

module.exports = {
    screenshotPath: join(__dirname, 'screenshots'),
    pageLoadInterval: 250, // milliseconds
    consoleLogSuccess: true, //Show successful page screenshots in console log?
    consoleLogFails: true, // Show failed page loads in console log?
    fileLogFails: true, // Save failed page loads to file? (fails.txt)
    saveFormat: 'png', // Options are 'png' or 'pdf',
    width: 1920, // Screenshot width,
    httpCodeWhitelist: [200, 201, 202, 203]
}