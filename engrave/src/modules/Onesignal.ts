
import * as https from 'https';
import { IBlog } from '../helpers/IBlog';

export class Onesignal {

    static sendNotification (blogger: IBlog, title: string, image: string, permlink: string) {

        if(blogger.onesignal_api_key != "" && blogger.onesignal_app_id != "") {
            var message = {
                app_id: blogger.onesignal_app_id,
                headings: {
                    "en": blogger.blog_title
                },
                contents: {
                    "en": title
                },
                url: "https://" + blogger.domain + "/" + permlink,
                big_picture: image,
                chrome_big_picture: image,
                chrome_web_image: image,
                chrome_web_icon: blogger.onesignal_logo_url,
                included_segments: ["All"]
            };
    
            this.processOnesignalNotification(blogger, message);
        }
    }

    private static processOnesignalNotification = function (blogger: IBlog, data: any) {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic " + blogger.onesignal_api_key
        };
    
        const options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };
    
        const req = https.request(options, function (res) {
            res.on('data', function (data) {
                console.log("Onesignal notifications sent");
            });
        });
    
        req.on('error', function (e) {
            console.log("ERROR:");
            console.log(e);
        });

        req.write(JSON.stringify(data));
        req.end();

    };

}