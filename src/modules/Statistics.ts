import { IBlog } from './../database/helpers/IBlog';
import { Blogs } from './../database/BlogsModel';
import { Statistics } from '../database/StatisticsModel'

let CronJob = require('cron').CronJob;
let steem = require('steem');

export class StatisticsModule {

    constructor () {
        console.log("Statistics module initialized");
        
        new CronJob('00 00 * * *', this.get_all_accounts_statistics, null, true, 'America/Los_Angeles');
    }

    private async get_all_accounts_statistics() {

        console.log("Statistics module entered at: " + Date());
        
        let accounts: string[] = [];

        try {
            let properties = await steem.api.getDynamicGlobalPropertiesAsync();
            let engraveUsers = await Blogs.find({}, { steem_username: 1 });

            engraveUsers.forEach((user: any) => {
                accounts.push(user.steem_username);
            })

            let steemAccountsArary = await steem.api.getAccountsAsync(accounts);

            steemAccountsArary.forEach(async (steemUser: any) => {

                let databaseUser = await Statistics.findOne({ steem_username: steemUser.name });

                if (!databaseUser) {
                    console.log("No steem_user in database. Adding new: ", steemUser.name);
                    databaseUser = new Statistics();
                    databaseUser.steem_username = steemUser.name;
                }

                var steemPower = steem.formatter.vestToSteem(steemUser.vesting_shares, properties.total_vesting_shares, properties.total_vesting_fund_steem);

                databaseUser.sbd.push(steemUser.sbd_balance.replace(" SBD", ""));
                databaseUser.steem.push(steemUser.balance.replace(" STEEM", ""));
                databaseUser.steem_power.push(steemPower);
                databaseUser.savings_steem.push(steemUser.savings_balance.replace(" STEEM", ""));
                databaseUser.savings_sbd.push(steemUser.savings_sbd_balance.replace(" SBD", ""));

                await databaseUser.save();
            });
        } catch(err) {
            console.log("Statistics error: ", err);
        }
    }

    static async GetStatistics(blog: IBlog) {
        try {
            let stats = await Statistics
                .find({ steem_username: blog.steem_username })
                .slice('savings_sbd', -30)
                .slice('savings_steem', -30)
                .slice('sbd', -30)
                .slice('steem', -30)
                .slice('steem_power', -30)
                .exec();
            return stats[0];  
        } catch (error) {
            return null;
        }
    }

}
