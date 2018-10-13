var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
    steemconnect_id: String,
    steemconnect_redirect_uri: String,
    website_title: String,
    website_credits: String,
    website_slogan: String,
    website_logo_url: String,
    website_favicon_url: String,

    opengraph_default_image: String,
    opengraph_default_description: String,
    
    editorial_username: String,
    editorial_posting_key: String,
    editorial_active_key: String,
    send_sbd_to_authors: Boolean,

    categories: [
        {
            _id: false,
            tags: [String],
            slug: String,
            name: String,
            color: String,
        }
    ],

    extra_tags: [String],

    onesignal_id: String,
    onesignal_apikey: String,
    onesignal_body_length: String,
    onesignal_logo_url: String,

    posts_from_categories_only: Boolean,
    theme: String,

    load_more_quantity: Number,
    posts_per_category_page: Number,

    info_add_root_author: Boolean,
    info_add_website: Boolean,
    info_website_info_text: String,

    frontpage_language: String,

    fb_fanpage_url: String,
    analytics_identifier: String,
    google_site_verification: String,

    show_resteems: Boolean,

    exclude_posts: [
        {with_name: [String]},
        {without_name: [String]},
        {with_tags: [String]},
        {without_tags: [String]},
    ]

});

module.exports = mongoose.model('settings', settingsSchema);