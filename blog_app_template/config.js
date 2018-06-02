let Blogs = require('./models/blogs');
let CronJob = require('cron').CronJob;

let config = {
    port: process.env.PORT || 8080,
    database_url: process.env.DATABASE_URL || "mongodb://user:password@database",
    theme: process.env.THEME || 'default',
    beneficiary: process.env.BENEFICIARY || "nicniezgrublem",
    steem_username: process.env.STEEM_USERNAME || "acronyms",
    beneficiary_share_percentage: process.env.BENEFICIARY_SHARE_PERCENTAGE || "5",
    domain: process.env.DOMAIN || 'localhost',
    session_secret: process.env.SESSION_SECRET || 'PUT_RANDOM_CHARACTERS_HERE',
}

module.exports.get_config = () => {
    return config;
}

module.exports.refresh_config = (cb) => {
    console.log("Settings refreshing: " + Date());
    Blogs.findOne({steem_username: config.steem_username}, function(err, blog) {
        if(!err && blog) {
            config = blog;          
            if(cb) {
                cb();
            }
        } else {
            console.log('error while searching blog settings');
        }
    })
}

module.exports.init_refreshing = () => {
    console.log("Settings refreshig every minute!")
    new CronJob('* * * * *', function () { module.exports.refresh_config() }, null, true, 'America/Los_Angeles');
}
