import { Statistics } from '../../models/StatisticsModel';
import { Blogs } from '../../submodules/engrave-shared/models/BlogsModel';
const steem = require('steem');

async function getAllAccountsStatistics () {
    console.log("Statistics module entered at: " + Date());
    
    let accounts: string[] = [];

    try {
        const properties = await steem.api.getDynamicGlobalPropertiesAsync();
        const engraveUsers = await Blogs.find({}, { steem_username: 1 });
        
        engraveUsers.forEach((user: any) => {
            accounts.push(user.steem_username);
        })
        
        const steemAccounts = await steem.api.getAccountsAsync(accounts);

        for(const steemUser of steemAccounts) {
            let databaseUser = await Statistics.findOne({ steem_username: steemUser.name });

            if (!databaseUser) {
                console.log("No steem_user in database. Adding new: ", steemUser.name);
                databaseUser = new Statistics();
                databaseUser.steem_username = steemUser.name;
            }

            const steemPower = steem.formatter.vestToSteem(steemUser.vesting_shares, properties.total_vesting_shares, properties.total_vesting_fund_steem);

            databaseUser.sbd.push(steemUser.sbd_balance.replace(" SBD", ""));
            databaseUser.steem.push(steemUser.balance.replace(" STEEM", ""));
            databaseUser.steem_power.push(steemPower);
            databaseUser.savings_steem.push(steemUser.savings_balance.replace(" STEEM", ""));
            databaseUser.savings_sbd.push(steemUser.savings_sbd_balance.replace(" SBD", ""));

            await databaseUser.save();
        }

    } catch(err) {
        console.log("Statistics error: ", err);
    }
}

export default getAllAccountsStatistics;