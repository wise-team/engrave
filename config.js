let config = {
    port: process.env.PORT || "8080",
    session_secret: process.env.SESSION_SECRET || 'PcxgE3gU3uyhed9LdfIRMHTpF9UXI7glEO1AYlKO',
    database_url: process.env.DATABASE_URL || "mongodb://user:password@server.com",
    steemconnect_id: process.env.STEEMCONNECT_ID || 'engrave.app',
    steemconnect_redirect_uri: process.env.STEEMCONNECT_REDIRECT_URI || 'https://localhost/authorize/',
    beneficiary: process.env.BENEFICIARY || "tiploo",
    domain: process.env.DOMAIN || 'engrave.site',
    blog_domains: (process.env.BLOG_DOMAINS) ? (JSON.parse(process.env.BLOG_DOMAINS)) : [process.env.DOMAIN],
}

module.exports = config;