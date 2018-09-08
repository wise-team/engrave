let path = require('path');
let CronJob = require('cron').CronJob;
let config = require('../config');
let Blogs = require('../database/blogs.js');
var nginx = require('./nginx.js');

module.exports.generateCertificatesForDomain = (domain, cb) => {
    if(domain && process.env.SSL_CERTIFICATES_DIR && process.env.SSL_EMAIL) {

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
                [ domain, 
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
        
        greenlock.register(opts).then(function (certs) {
            console.log(" * SSL certificates generated sucessfully!");
            if(cb) {
                cb(null);
            }
        }, function (err) {
            console.log(" * Error on generating SSL certificates!");
            console.log(err);
            if(cb) {
                cb(err);
            }
        });
    } else {
        if(cb) {
            console.log("SSL module ened to be configured first");
            cb(new Error('SSL module need to be configurated first'));
        }
    }
}

module.exports.initialize = () => {
    console.log("SSL module initialized");

    new CronJob('*/15 * * * *', function () { 
        
        generateCertificatesForUnsecuredBlogs();

    }, null, true, 'America/Los_Angeles');

}

function generateCertificatesForUnsecuredBlogs() {
    Blogs.find({ssl: {$ne: true}, configured: true, is_domain_custom: true}, (err, blogs) => {
        if(!err && blogs) {
            blogs.forEach(blog => {
                console.log("Unsecured blog: ", blog.domain);

                exports.generateCertificatesForDomain(blog.domain, (err) => {
                    if(!err) {
                        console.log(" * SSL generated for ", blog.domain);
                        nginx.generateCustomDomainConfigWithSSL(blog.domain, blog.port, (err) => {
                            if(!err) {
                                console.log(" * NGINX with SSL generated for ", blog.domain);
                                blog.ssl = true;
                                blog.save((err) => {
                                    if(!err) {
                                        console.log(" * Database entry saved for blog");
                                    } else {
                                        console.log(" * Saving database failed for blog");
                                    }
                                });
                            }
                        })
                    } else {
                        console.log(" * Unable to generate SSL for: ", blog.domain);
                    }
                })

            });
        }
    })
}