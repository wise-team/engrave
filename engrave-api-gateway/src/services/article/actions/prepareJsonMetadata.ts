const getUrls = require('get-urls');
const isImage = require('is-image');

export default (body: string, featured_image: string, tags: string[]) => {
    try {

        return {
            links: getLinks(body, false),
            image: getLinks(body, true),
            featured_image: featured_image,
        };

    } catch (error) {
        return {}
    }

}

const getLinks = (body: string, only_images: boolean): string[] => {
    try {

        let links: string[] = [];
        let images: string[] = [];

        getUrls(body).forEach( (url: string) => {
            
            let trimmed = url;

            if (url[url.length - 1] == ')') {
                trimmed = url.substring(0, url.length - 1);
            }

            if ( isImage(trimmed)) {
                images.push(trimmed);
            } else {
                links.push(trimmed);
            }

        });

        if(only_images) {
            return images;
        }

        return links;

    } catch (error) {
        return [];
    }
}