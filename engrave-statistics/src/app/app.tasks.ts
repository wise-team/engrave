import { CronJob } from 'cron';
import getAllAccountsStatistics from '../tasks/statistics/getAllAccounts';

function tasks() {
    console.log(" * Statistics module initialized");
    
    new CronJob('00 00 * * *', getAllAccountsStatistics, null, true, 'Europe/Warsaw');
}

export default tasks;