import { IJsonMetadata as IJsonMetadata } from "../../../submodules/engrave-shared/interfaces/IJsonMetadata";
import { IDraft } from "../../../submodules/engrave-shared/interfaces/IDraft";
import { IBlog } from "../../../submodules/engrave-shared/interfaces/IBlog";

const getUrls = require('get-urls');
const isImage = require('is-image');

export default async (article: IDraft, blog: IBlog): Promise<IJsonMetadata>=> {

    const json_metadata = {
        format: 'markdown',
        app: 'engrave',
        tags: article.tags,
        image: prepareImages(article),
        links: prepareLinks(article),
        users: prepareMentions(article.body)
    };

    return json_metadata;
}

const prepareMentions = (body: string): string[] => {
    const usernames = body.match(/@[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*(?:\.[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*)*/g);
    return uniq(usernames);
}

const prepareLinks = (article: IDraft): string[] => {

    let links: string[] = [];

    const urls: string[] = getUrls(article.body);

    urls.forEach(url => {
        
        let link = url;
        
        if (url[url.length - 1] == ')') {
            link = url.substring(0, url.length - 1);
        }

        if (!isImage(link)) {
            links.push(link);
        }
    })
    
    return links;
}

const prepareImages = (article: IDraft): string[] => {

    let images: string[] = [];

    if(article.featured_image) {
        images.push(article.featured_image);
    }

    const urls: string[] = getUrls(article.body);

    urls.forEach(url => {
        
        let link = url;
        
        if (url[url.length - 1] == ')') {
            link = url.substring(0, url.length - 1);
        }

        if (isImage(link)) {
            images.push(link);
        }
    })
    
    return images;
}

let uniq = (a: string[]) => [...new Set(a)];
