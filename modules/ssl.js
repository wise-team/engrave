let path = require('path');

module.exports.generateCertificatesForDomain = (domain, cb) => {
    if(domain && process.env.SSL_CERTIFICATES_DIR && process.env.SSL_EMAIL) {

        console.log(' * Trying to generate certificates');
        console.log('Trying to save at: ', path.join(__dirname, '../pm2_blogs/' + domain + '/public/.well-known/acme-challenge'));

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
        
        console.log("leStore:", leStore);
        console.log("opts:", opts);
        
        var greenlock = require('greenlock').create({
            version: 'draft-12',
            server: 'https://acme-v02.api.letsencrypt.org/directory',
            store: leStore
        });
        
        greenlock.register(opts).then(function (certs) {
            console.log(" * SSL certificates generated sucessfully!");
            console.log(certs);
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