import { Config } from "../config";

let fs = require('fs');
var ncp = require('ncp').ncp;
let path = require('path');

var pm2 = require('pm2');

let config = Config.GetConfig();

export class NodeAppsModule {

    static async createAndRun(domain: string, port: any, steem_username: string) {

        await pm2.connect();
        await ncp('./blog_app_template', './pm2_blogs/' + domain);

        let newAppConfig = {
            apps: [{
                name: domain,
                script: './pm2_blogs/' + domain + '/app.js',
                watch: false,
                env: {
                    PORT: port,
                    STEEM_USERNAME: steem_username,
                    DATABASE_URL: config.database_url,
                    NODE_ENV: "development"
                },
            }]
        };

        fs.writeFile(path.join(__dirname, '../../pm2_blogs/' + domain + '/app_config.json'), JSON.stringify(newAppConfig), { flag: 'w' } , (err: Error) => {
            if (!err) {
                console.log(' * Copying files completed.');

                pm2.start(path.join(__dirname, '../../pm2_blogs/' + domain + '/app_config.json'), function (err: Error, apps: any) {

                    if (err) {
                        console.log(err);
                    }

                    pm2.disconnect();   // Disconnects from PM2
                    console.log(' * New blog with domain: ' + domain + ' for: @' + steem_username + " is ready!");
                });

            } else {
                console.log(" * Copying files error:", err);
            }
        });

    };
}
