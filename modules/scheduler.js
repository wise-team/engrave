let CronJob = require('cron').CronJob;

module.exports.initialize = () => {
    console.log("Posts scheduler initialized");

    new CronJob('* * * * *', function () { return; }, null, true, 'America/Los_Angeles');

}
