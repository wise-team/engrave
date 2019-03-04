import axios from 'axios';

export default async (blog_title: string, article_title: string, article_url: string, image_url: string, api_key: string, app_id: string) => {

    const message = {
        app_id: app_id,
        headings: {
            "en": blog_title
        },
        contents: {
            "en": article_title
        },
        url: article_url,
        big_picture: image_url,
        chrome_big_picture: image_url,
        chrome_web_image: image_url,
        included_segments: ["All"]
        // chrome_web_icon: blogger.onesignal_logo_url,
    };

    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic " + api_key
    };

    const options = {
        url: "https://onesignal.com/api/v1/notifications",
        method: 'POST',
        headers: headers,
        data: message,
    };

    return await axios(options);

}