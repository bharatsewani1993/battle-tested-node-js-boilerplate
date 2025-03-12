const cron = require('node-cron');

const initCron = () => {
    //cron to delete FreeWebsites
    //daily at 12:00 AM
    // cron.schedule('0 0 * * *', websiteService.deleteFreeUsersWebsite);

    //0 * * * *
    //every 1 hour.
    //cron.schedule('0 * * * *', userService.downGradeUnpaidUsers);

    //'0 */6 * * *';
    //Every six hours;
    //cron.schedule('*/10 * * * * *', websiteService.createSiteBackup);

    //0 * * * *
    //every 1 hour.
    //cron.schedule('0 * * * *', databaseService.createDBBackup);
}

module.exports = {
    initCron
}