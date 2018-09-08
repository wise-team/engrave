let CronJob = require('cron').CronJob;

export class Scheduler {
    constructor() {
        console.log("Scheduler module initialized");

        new CronJob('* * * * *', function () { return; }, null, true, 'America/Los_Angeles');
    }
}
