const XmlSitemap = require('xml-sitemap');
import { getLatestArticles, getBlog } from '../../../submodules/engrave-shared/services/cache/cache';
import * as moment from 'moment';
import { IArticle } from '../../../submodules/engrave-shared/interfaces/IArticle';
import * as fs from 'fs';
import { ICategory } from '../../../submodules/engrave-shared/interfaces/ICategory';

export default async (domain: string) => {
    
    const file = `/app/sitemaps/${domain}/sitemap.xml`;

    let sitemap = new XmlSitemap().setHost(`https://${domain}/`);

    const blog = await getBlog(domain);
    
    if(blog.categories.length) {
        blog.categories.forEach((category: ICategory) => {
            sitemap.add(`category/${category.slug}`, {
                priority: 1
            })
        });    
    }

    const articles = await getLatestArticles(blog._id, 0, 5000);

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