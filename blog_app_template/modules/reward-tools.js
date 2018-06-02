let CronJob = require('cron').CronJob;
let steem = require("steem");
let Articles = require("../models/articles.js");
let cfg = require('../config');

function checkAndClaimRewards() {
    steem.api.getAccounts([cfg.get_config().steem_username], function(err, results) {
        if(err) {
            console.log(err);
        } else {
            let sbdReward = parseFloat(results[0].reward_sbd_balance.replace(" SBD",""));
            let steemReward = parseFloat(results[0].reward_steem_balance.replace(" STEEM",""));
            let vestingReward = parseFloat(results[0].reward_vesting_balance.replace(" VESTS",""));
    
            if( (sbdReward + steemReward) > 0.5) {
                console.log("Found some funds to claim: " + sbdReward  +" SBD, " + steemReward + " STEEM, " + vestingReward + " VESTS");
                
                steem.broadcast.claimRewardBalance(cfg.get_config().editorial_active_key, cfg.get_config().steem_username, results[0].reward_steem_balance, results[0].reward_sbd_balance, results[0].reward_vesting_balance, function(err, result) {
                    if(err) {
                        console.log(err);
                    } else if(result) {
                        console.log(result);
                        console.log("All rewards claimed");
                    } else {
                        console.log("Jakis blad");
                    }
                });
            }
        }
    });
}

function settleAuthorsRewards() {
    steem.api.getAccountHistory(cfg.get_config().steem_username, -1, 1000, function(err, result) {
        if(err) {
            console.log(err);
            return;
        }

        let cnt = 0;
        
        result.forEach(action => {
            cnt++;
            if(action[1].op[0] == "author_reward") {
                let reward = action[1].op[1];
                Articles.findOne({permlink: reward.permlink}, function(err, article) {
                    if(article && article.settled != true) {
                        if(article.user != cfg.get_config().steem_username) {
                            console.log("Not settled: " + article.permlink + ": " + reward.sbd_payout);
    
                            if(article.user) {
                                steem.broadcast.transfer(cfg.get_config().editorial_active_key, cfg.get_config().steem_username, article.user, reward.sbd_payout, "Wynagrodzenie za artykuł: https://" + cfg.get_config().domain + "/" + article.permlink, function (err, sendResult) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        if(sendResult) {
                                            article.settled = true;
                                            article.save(function(err) {
                                                if(err) {
                                                    console.log("Jakis blad przy rozliczaniu");
                                                    console.log(err);
                                                } else {
                                                    console.log("Rozliczono i zapisano artykul: " + article.permlink);
                                                }
                                            });
                                        }
                                    }
                                }); 
                            }
                        }
                    }
                })
            }
        });
    });
}

module.exports.initialize = () => {
    
    new CronJob('*/10 * * * *', function() {
        if(cfg.get_config().send_sbd_to_authors) {
            checkAndClaimRewards();
            settleAuthorsRewards();
        }
    }, null, true, 'America/Los_Angeles');
    console.log("Rewards tools initialized");

}