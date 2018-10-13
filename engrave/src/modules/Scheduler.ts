let CronJob = require('cron').CronJob;

export class SchedulerModule {
    constructor() {
        console.log(" * Scheduler module initialized");

        new CronJob('* * * * *', function () { return; }, null, true, 'America/Los_Angeles');
    }
}
