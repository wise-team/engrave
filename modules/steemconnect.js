let steemconnect2 = require('sc2-sdk');
let config = require('../config');

let steem = steemconnect2.Initialize({
    app: config.steemconnect_id,
    callbackURL: config.steemconnect_redirect_uri,
    scope: ['login', 'vote', 'comment']
});

module.exports = steem;