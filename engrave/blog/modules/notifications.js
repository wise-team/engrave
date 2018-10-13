var cfg = require('../config');
var https = require('https');

var processOnesignalNotification = function (data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic " + cfg.get_config().onesignal_apikey
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            console.log("Onesignal Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
        // TODO error login to admin
    });

    req.write(JSON.stringify(data));
    req.end();
};


module.exports.sendNotification = function (title, body, image, permlink, category) {

    if(cfg.get_config().onesignal_apikey != "" && cfg.get_config().onesignal_id != "") {
        var message = {
            app_id: cfg.get_config().onesignal_id,
            headings: {
                "en": cfg.get_config().blog_title // + " / " + category
            },
            contents: {
                "en": title
            },
            url: "https://" + cfg.get_config().domain + "/" + permlink,
            big_picture: image,
            chrome_big_picture: image,
            chrome_web_image: image,
            chrome_web_icon: cfg.get_config().onesignal_logo_url, //  onesignal_logo_url
            included_segments: ["All"]
        };

        processOnesignalNotification(message);
    }
}