import { Config } from "../config";

let fs = require('fs');
var ncp = require('ncp').ncp;
let path = require('path');

var pm2 = require('pm2');

let config = Config.GetConfig();

export class NodeAppsModule {

    static async createAndRun(domain: string, port: any, steem_username: string) {

        pm2.connect((err: Error) => {
            if(err) console.log(err);
            else {
                
                const sourceBlogPath = path.join(__dirname, '../../blog');
                const destinationBlogPath = path.join(__dirname, '../../instances/' + domain);
                const instancesPath = path.join(__dirname, '../../instances');
                
                if (!fs.existsSync(instancesPath)) {
                    fs.mkdirSync(instancesPath);
                }

                ncp(sourceBlogPath, destinationBlogPath, function (err: Error) {
                    if (err) console.log("NCP error: ", err);
                    else {
                        let newAppConfig = {
                            apps: [{
                                name: domain,
                                script: './instances/' + domain + '/app.js',
                                watch: false,
                                env: {
                                    PORT: port,
                                    STEEM_USERNAME: steem_username,
                                    DATABASE_URL: config.database_url,
                                    NODE_ENV: "development"
                                },
                            }]
                        };
                
                        fs.writeFile(path.join(instancesPath, domain, 'app_config.json'), JSON.stringify(newAppConfig), { flag: 'w' } , (err: Error) => {
                            if (!err) {
                                console.log(' * Copying files completed.');
                
                                pm2.start(path.join(__dirname, '../../instances/' + domain + '/app_config.json'), function (err: Error, apps: any) {
                
                                    if (err) console.log(err);
                
                                    pm2.disconnect();   // Disconnects from PM2
                                    console.log(' * New blog with domain: ' + domain + ' for: @' + steem_username + " is ready!");
                                });
                
                            } else {
                                console.log(" * Copying files error:", err);
                            }
                        });
                    }
                });
            }
        });
        
    };
}
