import { Domains } from './Domains';
import { Blogs } from "../database/BlogsModel";

let CronJob = require('cron').CronJob;
let steem = require('steem');

export class SteemWatcher {

    constructor() {
        console.log(" * Statistics module initialized");

        new CronJob('*/1 * * * *', this.checkHistory, null, true, 'America/Los_Angeles');
    }

    private async checkHistory() {

        try {

            const operations = await steem.api.getAccountHistoryAsync('acronyms', -1, 25);
            const transfers = operations.filter((tx: any) => (tx[1].op[0] == 'transfer') && (tx[1].op[1].amount == '0.100 SBD') );

            for (const transfer of transfers) {
                try {
                    const from = transfer[1].op[1].from;
                    let blogger = await Blogs.findOne({ steem_username: from });
    
                    if (blogger && !blogger.paid && !blogger.configured && blogger.domain) {
                        await Domains.processDomainOrder(blogger.domain);
                        blogger.paid = true;
                        await blogger.save();
                    }
                } catch (error) {
                    console.log("Registering domain error: ", error);
                }
            }

        } catch (err) {
            console.log("Watcher error", err);
        }
    }

}