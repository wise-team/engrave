import { Blogs } from './../database/BlogsModel';
import { NginxModule } from "./Nginx";

let path = require('path');
let CronJob = require('cron').CronJob;

export class SSLModule {
    constructor() {

        console.log("SSL module initialized");

        new CronJob('*/15 * * * *', this.generateCertificatesForUnsecuredBlogs, null, true, 'America/Los_Angeles');
    }

    static generateCertificatesForDomain(domain: string, cb: any) {
        if (domain && process.env.SSL_CERTIFICATES_DIR && process.env.SSL_EMAIL) {

            console.log(' * Trying to generate certificates');

            var leStore = require('le-store-certbot').create({
                configDir: process.env.SSL_CERTIFICATES_DIR          // or /etc/acme or wherever
                , privkeyPath: ':configDir/live/:hostname/privkey.pem'          //
                , fullchainPath: ':configDir/live/:hostname/fullchain.pem'      // Note: both that :configDir and :hostname
                , certPath: ':configDir/live/:hostname/cert.pem'                //       will be templated as expected by
                , chainPath: ':configDir/live/:hostname/chain.pem'              //       greenlock.js

                , logsDir: process.env.SSL_CERTIFICATES_DIR + '/engrave-logs'

                , webrootPath: path.join(__dirname, '../pm2_blogs/:hostname/public/.well-known/acme-challenge')

                , debug: false
            });

            var opts = {
                domains:
                    [domain,
                        'www.' + domain],
                email: process.env.SSL_EMAIL,
                agreeTos: true,
                communityMember: false
            };

            var greenlock = require('greenlock').create({
                version: 'draft-12',
                server: 'https://acme-v02.api.letsencrypt.org/directory',
                store: leStore
            });

            greenlock.register(opts).then(function (certs: any) {
                console.log(" * SSL certificates generated sucessfully!");
                if (cb) {
                    cb(null);
                }
            }, function (err: Error) {
                console.log(" * Error on generating SSL certificates!");
                console.log(err);
                if (cb) {
                    cb(err);
                }
            });
        } else {
            if (cb) {
                console.log("SSL module ened to be configured first");
                cb(new Error('SSL module need to be configurated first'));
            }
        }
    }

    private async generateCertificatesForUnsecuredBlogs() {

        try {
            let blogs = await Blogs.find({ ssl: { $ne: true }, configured: true, is_domain_custom: true });
            blogs.forEach((blog: any) => {
                console.log("Unsecured blog: ", blog.domain);

                SSLModule.generateCertificatesForDomain(blog.domain, (err: Error) => {
                    if (!err) {
                        console.log(" * SSL generated for ", blog.domain);
                        NginxModule.generateCustomDomainConfigWithSSL(blog.domain, blog.port, async (err: Error) => {
                            if (!err) {
                                console.log(" * NGINX with SSL generated for ", blog.domain);
                                
                                blog.ssl = true;
                                await blog.save();
                                
                                console.log(" * Database entry saved for blog");
                            }
                        })
                    } else {
                        console.log(" * Unable to generate SSL for: ", blog.domain);
                    }
                })

            });

        } catch(err) {
            console.log("Generating SSL error:", err);
        }
    }
}