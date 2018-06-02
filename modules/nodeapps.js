let config = require('../config.js');
let fs = require('fs');
var ncp = require('ncp').ncp;
let path = require('path');

var pm2 = require('pm2');

module.exports.createAndRun = (domain, port, steem_username) => {
    pm2.connect(function (err) {
        if (err) {
            console.error(err);
        }

        ncp('./blog_app_template', './pm2_blogs/' + domain, function (err) {
            if (err) {
                return console.error(err);
            }

            let testconfig = {
                apps: [{
                    name: domain,
                    script: './pm2_blogs/' + domain + '/app.js',
                    watch: true,
                    env: {
                        PORT: port,
                        STEEM_USERNAME: steem_username,
                        DATABASE_URL: config.database_url,
                        NODE_ENV: "development"
                    },
                }]
            };

            let teetteet = JSON.stringify(testconfig);

            fs.writeFile(path.join(__dirname, '../pm2_blogs/' + domain + '/app_config.json'), teetteet, (err) => {
                if (!err) {
                    console.log('createAndRun: The file has been saved!');

                    pm2.start(path.join(__dirname, '../pm2_blogs/' + domain + '/app_config.json'), function (err, apps) {

                        if(err) {
                            console.log(err);
                        }
                        

                        console.log('teet');
                        pm2.disconnect();   // Disconnects from PM2
                        console.log('done!');

                        // if (err) throw err
                    });

                } else {
                    console.log("write file error:", err);
                }
            });

        });


    });

}; 


module.exports.generateCustomDomainConfig = (domain, port, cb) => {
    let tmp1 = domain_template.replace(/EXAMPLE/g, domain);
    let tmp2 = tmp1.replace(/PORT/g, port);

    fs.writeFile(domain, tmp2, (err) => {
        if (!err) {
            console.log('nginx.generateCustomDomainConfig: The file has been saved!');
        }

        if (cb) {
            cb(err);
        }
    });

};