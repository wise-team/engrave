import { Schema, Model, model } from "mongoose";
import { INewBlog } from '../submodules/engrave-shared/interfaces/INewBlog';

export let BlogSchema = new Schema({

    username: String,
    url: String,
    domain: String,
    domain_redirect: Boolean,
    title: String,
    slogan: String,
    logo_url: String,
    main_image: String,

    link_facebook: String,
    link_twitter: String,
    link_linkedin: String,
    link_instagram: String,

    opengraph_default_image_url: String,
    opengraph_default_description: String,
    onesignal_app_id: String,
    onesignal_api_key: String,
    onesignal_body_length: Number,
    onesignal_logo_url: String,
    analytics_gtag: String,
    webmastertools_id: String,
    
    lang: String,
    theme: String,

    premium: {
        type: Boolean,
        default: false
    },
    adopter: {
        type: Boolean,
        default: false
    },

    categories: [
        {
            name: String,
            slug: String,
            description: String
        }
    ]
});

export let BlogsModel: Model<INewBlog> = model<INewBlog>('newblogs', BlogSchema);