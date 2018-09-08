let CronJob = require('cron').CronJob;

let steem = require('steem');

let StatisticsModel = require('../database/statistics.js');
let BlogsModel = require('../database/blogs.js');

export class Statistics {

    constructor () {
        console.log("Statistics module initialized");
        
        new CronJob('00 00 * * *', this.get_all_accounts_statistics, null, true, 'America/Los_Angeles');
    }

    private async get_all_accounts_statistics() {

        console.log("Statistics module entered at: " + Date());
        
        let accounts: string[] = [];

        try {
            let properties = await steem.api.getDynamicGlobalPropertiesAsync();
            let engraveUsers = await BlogsModel.find({}, { steem_username: 1 });

            engraveUsers.forEach((user: any) => {
                accounts.push(user.steem_username);
            })

            let steemAccountsArary = await steem.api.getAccountsAsync(accounts);

            steemAccountsArary.forEach(async (steemUser: any) => {

                let databaseUser = await StatisticsModel.findOne({ steem_username: steemUser.name });

                if (!databaseUser) {
                    console.log("No steem_user in database. Adding new: ", steemUser.name);
                    databaseUser = new StatisticsModel();
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

}
