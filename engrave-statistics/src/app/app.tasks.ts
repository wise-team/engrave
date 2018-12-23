import { CronJob } from 'cron';
import getAllAccounts from '../tasks/statistics/getAllAccounts';

function tasks() {
    console.log(" * Statistics module initialized");
    
    new CronJob('00 00 * * *', getAllAccounts, null, true, 'Europe/Warsaw');
}

export default tasks;