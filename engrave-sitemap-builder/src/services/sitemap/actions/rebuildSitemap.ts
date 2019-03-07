const XmlSitemap = require('xml-sitemap');
import { getLatestArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import * as moment from 'moment';
import { IArticle } from '../../../submodules/engrave-shared/interfaces/IArticle';
import * as fs from 'fs';

export default async (domain: string, username: string) => {
    
    const file = `/app/sitemaps/${domain}/sitemap.xml`;

    let sitemap = new XmlSitemap().setHost(`https://${domain}/`);

    const articles = await getLatestArticles(username, 0, 50000);

    articles.forEach((article: IArticle) => {

        try {
            sitemap.add(article.permlink, {
                lastmod: moment(article.created).toISOString(),
                priority: 0.8
            })
        } catch (error) {
            console.log(error);
            // ignore as it is probably because adding the same permlink
        }

    });


    validateSitemapDirectory(domain);

    fs.writeFileSync(file, sitemap.xml);

    return sitemap.xml;

}

const validateSitemapDirectory = (domain: string) => {
    const path = `/app/sitemaps/${domain}`;
    if(! fs.existsSync(path)) {
        fs.mkdirSync(path, {recursive: true});
    }
}