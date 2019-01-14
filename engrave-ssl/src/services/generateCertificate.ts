const leStore = require('le-store-certbot').create({
    configDir: process.env.SSL_CERTIFICATES_DIR,                   // or /etc/acme or wherever
    privkeyPath: ':configDir/live/:hostname/privkey.pem',          //
    fullchainPath: ':configDir/live/:hostname/fullchain.pem',      // Note: both that :configDir and :hostname
    certPath: ':configDir/live/:hostname/cert.pem',                //       will be templated as expected by
    chainPath: ':configDir/live/:hostname/chain.pem',              //       greenlock.js
    logsDir: process.env.SSL_CERTIFICATES_DIR + '/engrave-logs',
    webrootPath: '/app/certbot/.well-known/acme-challenge',
    debug: false
});

export default async (domain: string) => {
    try {
        console.log(' * Trying to generate certificates');

        const opts = { domains: [domain, 'www.' + domain], email: process.env.SSL_EMAIL, agreeTos: true, communityMember: false };
        const greenlock = require('greenlock').create({ version: 'draft-12', server: 'https://acme-v02.api.letsencrypt.org/directory', store: leStore });

        await greenlock.register(opts);

        console.log(" * SSL certificates generated sucessfully!");
    } catch (error) {
        console.log(" * SSL error: ", error);
        throw error;
    }
}