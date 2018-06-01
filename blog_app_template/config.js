var fs = require('fs');

let config = {
    port: process.env.PORT || 82,
    steemconnect_id: process.env.STEEMCONNECT_ID || 'glodniwiedzy.app',
    steemconnect_redirect_uri: process.env.STEEMCONNECT_REDIRECT_URI || 'https://localhost/authorize/',
    website_title: process.env.WEBSITE_TITLE || 'Steem Blog',
    website_credits: process.env.WEBSITE_CREDITS || 'All rights reserved.',
    website_slogan: process.env.WEBSITE_SLOGAN || 'Your blog based on Steem blockchain network',
    website_logo_url: process.env.WEBSITE_LOGO_URL || "",
    website_favicon_url: process.env.WEBSITE_FAVICON_URL || "",
    domain: process.env.DOMAIN || 'localhost',

    opengraph_default_image: process.env.OPENGRAPH_DEFAULT_IMAGE || "",
    opengraph_default_description: process.env.OPENGRAPH_DEFAULT_DESCRIPTION || "",
    
    editorial_username: process.env.EDITORIAL_STEEM_USERNAME || 'glodniwiedzy',
    editorial_posting_key: process.env.EDITORIAL_POSTING_KEY || "",
    
    session_secret: process.env.SESSION_SECRET || 'some random secret key here',
    
    database_url: process.env.DATABASE_URL || "mongodb://user:password@server.com",
    
    categories: JSON.parse(fs.readFileSync(__dirname + '/config/categories.json', 'utf8')),
    extra_tags: JSON.parse(fs.readFileSync(__dirname + '/config/extra_tags.json', 'utf8')),

    onesignal_id: process.env.ONESIGNAL_ID || "",
    onesignal_apikey: process.env.ONESIGNAL_APIKEY || "",
    onesignal_body_length: process.env.ONESIGNAL_NOTIFICATION_LENGTH || 120,
    
    wykop_username: process.env.WYKOP_USERNAME || "",
    wykop_token: process.env.WYKOP_TOKEN || "",

    posts_from_categories_only: process.env.POSTS_FROM_CATEGORIES_ONLY || "false",
    theme: process.env.THEME || 'default',

    load_more_quantity: process.env.LOAD_MORE_QUANTITY || 9,
    category_articles_quantity: process.env.CATEGORY_ARTICLES_QUANTITY || 21,

    beneficiary: process.env.BENEFICIARY || "",
    beneficiary_share_percentage: process.env.BENEFICIARY_SHARE_PERCENTAGE || "",

    info_add_root_author: process.env.INFO_ADD_ROOT_AUTHOR || "true",
    info_add_website: process.env.INFO_ADD_WEBSITE || "true",

    info_website_info_text: process.env.INFO_WEBSITE_INFO_TEXT || "pl",

    frontpage_language: process.env.FRONTPAGE_LANGUAGE || "pl",

    fb_fanpage_url: process.env.FB_FANPAGE_URL || "",
    analytics_identifier: process.env.ANALYTICS_IDENTIFIER || "",
    google_site_verification: process.env.GOOGLE_SITE_VERIFICATION || ""
}
module.exports = config;