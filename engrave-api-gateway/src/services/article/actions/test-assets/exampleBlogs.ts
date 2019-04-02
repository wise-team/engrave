import { CollaborationType } from './../../../../submodules/engrave-shared/enums/CollaborationType';

const exampleBlogs: any = [
    {
        owner: 'string',
        
        collaboration_type: CollaborationType.MANY_USERS,

        collaborators: [],
        domain: 'string',
        custom_domain: 'string',
        domain_redirect: true,
        title: 'string',
        slogan: 'string',
        logo_url: 'string',
        favicon_url: 'string',
        main_image: 'string',

        link_facebook: 'string',
        link_twitter: 'string',
        link_linkedin: 'string',
        link_instagram: 'string',

        opengraph_default_image_url: 'string',
        opengraph_default_description: 'string',

        onesignal_app_id: 'string',
        onesignal_api_key: 'string',
        onesignal_body_length: 124,
        onesignal_logo_url: 'string',

        analytics_gtag: 'string',
        webmastertools_id: 'string',

        theme: 'string',

        premium: false,

        categories: [],

        content_category: String
    }
]

export default exampleBlogs;