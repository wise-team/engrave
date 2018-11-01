import { Blogs } from './../database/BlogsModel';
import { NginxModule } from "./Nginx";

let path = require('path');
let CronJob = require('cron').CronJob;

export class SSLModule {

    private static leStore = require('le-store-certbot').create({
        configDir: process.env.SSL_CERTIFICATES_DIR,          // or /etc/acme or wherever
        privkeyPath: ':configDir/live/:hostname/privkey.pem',          //
        fullchainPath: ':configDir/live/:hostname/fullchain.pem',      // Note: both that :configDir and :hostname
        certPath: ':configDir/live/:hostname/cert.pem',                //       will be templated as expected by
        chainPath: ':configDir/live/:hostname/chain.pem',              //       greenlock.js
        logsDir: process.env.SSL_CERTIFICATES_DIR + '/engrave-logs',
        webrootPath: path.join(__dirname, '../instances/:hostname/public/.well-known/acme-challenge'),
        debug: false
    });

    constructor() {

        console.log(" * SSL module initialized");

        new CronJob('*/15 * * * *', this.generateCertificatesForUnsecuredBlogs, null, true, 'America/Los_Angeles');
        new CronJob('00 00 * * *', this.regenerateCertificates, null, true, 'America/Los_Angeles');
    }

    static async generateCertificatesForDomain(domain: string) {
        console.log(' * Trying to generate certificates');

        const opts = { domains: [domain, 'www.' + domain], email: process.env.SSL_EMAIL, agreeTos: true, communityMember: false };
        const greenlock = require('greenlock').create({ version: 'draft-12', server: 'https://acme-v02.api.letsencrypt.org/directory', store: this.leStore });

        await greenlock.register(opts);

        console.log(" * SSL certificates generated sucessfully!");
    }

    private async generateCertificatesForUnsecuredBlogs() {

        try {
            let blogs = await Blogs.find({ ssl: { $ne: true }, configured: true, is_domain_custom: true });
            blogs.map(async (blog) => {
                console.log("Unsecured blog: ", blog.domain);
                await SSLModule.generateCertificatesForDomain(blog.domain);
                console.log(" * SSL generated for ", blog.domain);
                NginxModule.generateNginxSettings(blog);
                console.log(" * NGINX with SSL generated for: ", blog.domain);
                blog.ssl = true;
                await blog.save();
                console.log(" * Database entry saved for blog");
            });
        } catch (error) {
            console.log("Generating SSL error:", error);
        }
    }

    private async regenerateCertificates() {

        try {
            let blogs = await Blogs.find({ ssl: true, configured: true, is_domain_custom: true });
            blogs.map(async (blog) => {
                console.log(" * Regenerating SSL certificates for: ", blog.domain);
                await SSLModule.generateCertificatesForDomain(blog.domain);
            });
        } catch (error) {
            console.log(" * Regenerating SSL error:", error);
        }
    }
}