let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let blogSchema = new Schema({

    steem_username: String,
    email: String,
    port: Number,
    created: Date,

    tier: Number,

    configured: Boolean,
    
    author_name: String,
    author_surname: String,
    author_bio: String,

    link_facebook: String,
    link_twitter: String,
    link_linkedin: String,
    link_instagram: String,

    blog_title: String,
    blog_slogan: String,
    blog_logo_url: String,

    opengraph_default_image: String,
    opengraph_default_description: String,

    onesignal_id: String,
    onesignal_apikey: String,
    onesignal_body_length: Number,

    analytics_gtag: String,

    theme: String,

    categories: [
        {
            steem_tag: String,
            slug: String,
            name: String
        }
    ],

    single: {
        show_author_box: Boolean,
        show_similar: Boolean
    },

    sidebar: {
        show_latest: Boolean,
        show_featured: Boolean
    }
});

module.exports = mongoose.model('blogs', blogSchema);