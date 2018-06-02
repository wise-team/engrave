let Blogs = require('./models/blogs');

let config = {
    port: process.env.PORT || 8080,
    database_url: process.env.DATABASE_URL || "mongodb://user:password@database",
    theme: process.env.THEME || 'default',
    beneficiary: process.env.BENEFICIARY || "nicniezgrublem",
    steem_username: process.env.EDITORIAL_USERNAME || "acronyms",
    beneficiary_share_percentage: process.env.BENEFICIARY_SHARE_PERCENTAGE || "5",
    domain: process.env.DOMAIN || 'localhost',
    session_secret: process.env.SESSION_SECRET || 'PUT_RANDOM_CHARACTERS_HERE',
}

module.exports.get_config = () => {
    return config;
}

module.exports.refresh_config = (cb) => {

    Blogs.findOne({steem_username: config.steem_username}, function(err, blog) {
        console.log("Settings refreshed: " + Date());
        if(!err && blog) {
            config = blog;
            config.port = 8080;
            config.session_secret = 'asdadsdsdgsdgsdgsg';
            if(cb) {
                setTimeout(module.exports.refresh_config, 60*1000);
                cb();
            }
        } else {
            console.log('error while searching blog settings');
        }
    })
}