import { Tier } from './TierEnum';
import { Document } from "mongoose";

export interface IBlog extends Document {
    steem_username: string;
    email: string;
    port: number;
    domain: string;
    is_domain_custom: boolean;
    ssl: boolean;
    created: Date;
    tier: Tier;
    configured: boolean;
    category: string;
    deployed: boolean;
    author_name: string;
    author_surname: string;
    author_bio: string;
    author_image_url: string;
    link_facebook: string;
    link_twitter: string;
    link_linkedin: string;
    link_instagram: string;
    blog_title: string;
    blog_slogan: string;
    blog_logo_url: string;
    blog_main_image: string;
    opengraph_default_image_url: string;
    opengraph_default_description: string;
    onesignal_app_id: string;
    onesignal_api_key: string;
    onesignal_body_length: number;
    onesignal_logo_url: string;
    analytics_gtag: string;
    webmastertools_id: string;
    frontpage_language: string;
    theme: string;
    show_only_categorized_posts: boolean;
    show_everything: boolean;
    posts_per_category_page: number;
    load_more_posts_quantity: number;
    categories: [{
        steem_tag: string;
        slug: string;
        name: string;
    }];
    single: {
        show_author_box: boolean;
        show_similar: boolean;
    };
    sidebar: {
        show_latest: boolean;
        show_featured: boolean;
    };
    paid: boolean;
}