let CronJob = require('cron').CronJob;
let Articles = require('../models/articles.js');
let Users = require('../models/users.js');
let moment = require('moment');

function isOlderThanAWeek(date) {
    let seven_days_ago = moment().subtract(7, 'days');
    return moment(date).isBefore(seven_days_ago);
}

function checkAndReassembleRewardsLinks() {
    console.log("Just checked links");
    Articles.find({}, function (err, articles) {
        articles.forEach(article => {
            if (article.permlink) {
                if ( ( ! article.date) || isOlderThanAWeek(article.date)) {
                    // console.log("Older " + article.permlink, article.date);
                }
            }
        });
    })
}

module.exports.initialize = () => {
    checkAndReassembleRewardsLinks();
    // new CronJob('* * * * *', function () { checkAndReassembleRewardsLinks() }, null, true, 'America/Los_Angeles');
    console.log("Rewards tools initialized");
}