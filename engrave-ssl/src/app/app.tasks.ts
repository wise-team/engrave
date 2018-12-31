import { CronJob } from 'cron';
import secureNewBlogs from '../tasks/certificates/secureNewBlogs';
import regenerateAll from '../tasks/certificates/regenerateAll';

function tasks() {
    console.log(" * SSL module initialized");

    new CronJob('*/15 * * * *', secureNewBlogs, null, true, 'America/Los_Angeles');
    new CronJob('00 00 * * *', regenerateAll, null, true, 'America/Los_Angeles');
}

export default tasks;