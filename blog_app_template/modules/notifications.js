const config = require('../config');
var https = require('https');

var processOnesignalNotification = function (data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic " + config.onesignal_apikey
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

    if(config.onesignal_apikey != "" && config.onesignal_id != "") {
        var message = {
            app_id: config.onesignal_id,
            headings: {
                "en": config.website_title // + " / " + category
            },
            contents: {
                "en": title
            },
            url: "https://" + config.domain + "/" + permlink,
            big_picture: image,
            chrome_big_picture: image,
            chrome_web_image: image,
            chrome_web_icon: process.env.ONESIGNAL_ICON_URL,
            included_segments: ["All"]
        };

        processOnesignalNotification(message);
    }
}