import { CronJob } from 'cron';
import getAllAccountsStatistics from '../tasks/statistics/getAllAccounts';
import storeCoinsPrice from '../tasks/coins/storeCoinsPrice';

function tasks() {
    console.log(" * Statistics module initialized");
    
    new CronJob('00 00 * * *', getAllAccountsStatistics, null, true, 'Europe/Warsaw');
    new CronJob('00 */1 * * *', storeCoinsPrice, null, true, 'Europe/Warsaw');
}

export default tasks;