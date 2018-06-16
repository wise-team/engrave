let CronJob = require('cron').CronJob;
let config = require('../config');
let steem = require('steem');
let Statistics = require('../database/statistics.js');
let Blogs = require('../database/blogs.js');

module.exports.initialize = () => {
    console.log("Statistics module initialized");

    new CronJob('00 00 * * *', function () { 
        
        get_all_accounts_statistics();

    }, null, true, 'America/Los_Angeles');

}

function get_all_accounts_statistics() {

    console.log("Statistics module entered at: " + Date() );

    steem.api.getDynamicGlobalProperties((err, variables) => {
        // var accountValue = steem.formatter.estimateAccountValue(req.session.steemconnect.name); // promise :/
        Blogs.find({}, {steem_username: 1}, function (err, users) {
        
            let accounts = [];
    
            users.forEach((user)=> {
                accounts.push(user.steem_username);
            })
    
            steem.api.getAccounts(accounts, function(err, result) {
                if(!err) {
                    result.forEach((steem_user) => {
                        Statistics.findOne({steem_username: steem_user.name}, function(err, _user) {
                            if(!err) {
                                if(!_user) {
                                    console.log("No steem_user in database. Adding new");
                                    _user = new Statistics();
                                    _user.steem_username = steem_user.name;
                                }                                
                                var steemPower = steem.formatter.vestToSteem(steem_user.vesting_shares, variables.total_vesting_shares, variables.total_vesting_fund_steem);

                                _user.sbd.push(steem_user.sbd_balance.replace(" SBD", ""));
                                _user.steem.push(steem_user.balance.replace(" STEEM", ""));
                                _user.steem_power.push(steemPower);
                                _user.savings_steem.push(steem_user.savings_balance.replace(" STEEM", ""));
                                _user.savings_sbd.push(steem_user.savings_sbd_balance.replace(" SBD", ""));
    
                                _user.save((err)=> {
                                    if(err) {
                                        console.log(err)
                                    }
                                });
                            } else {
                                console.log("Error reading database!");
                            }
                        });
                    })
                }
            });
        });
    });
}