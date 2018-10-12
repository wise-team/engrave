export interface IConfig {
    port: string;
    session_secret: string;
    database_url: string;
    steemconnect_id: string;
    steemconnect_redirect_uri: string;
    beneficiary: string;
    domain: string;
    blogs_domains: string[];
    blogs_categories: string[];
}

export class Config {
    private static instance: Config;
    private static config: IConfig;
    
    private constructor() {
        Config.config = {
            port: process.env.PORT || "80",
            session_secret: process.env.SESSION_SECRET || 'PcxgE3gU3uyhed9LdfIRMHTpF9UXI7glEO1AYlKO',
            database_url: process.env.DATABASE_URL || "mongodb://mongo:27017/engrave",
            steemconnect_id: process.env.STEEMCONNECT_ID || 'engrave.app',
            steemconnect_redirect_uri: process.env.STEEMCONNECT_REDIRECT_URI || 'http://localhost:8080/authorize/',
            beneficiary: process.env.BENEFICIARY || "engrave",
            domain: process.env.DOMAIN || 'localhost',
            blogs_domains: (process.env.BLOGS_DOMAINS) ? (JSON.parse(process.env.BLOGS_DOMAINS)) : [process.env.DOMAIN],
            blogs_categories: (process.env.BLOGS_CATEGORIES) ? (JSON.parse(process.env.BLOGS_CATEGORIES)) : ["Other"],
        }
    }

    static GetConfig () {
        if (!Config.instance) {
            Config.instance = new Config();
        }

        return Config.config;
    }
}