import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { getBlog, getLatestArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import { BlogNotExist } from '../../../submodules/engrave-shared/helpers/errorCodes';
import * as fs from 'fs';

const XmlSitemap = require('xml-sitemap');

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {

    return handleResponseError(async () => {

        const { hostname } = req;

        try {

            const blog = await getBlog(hostname);
            const articles = await getLatestArticles(blog.username, 0, 50000); // max available for sitemap

            var sitemap = new XmlSitemap();

            sitemap.add(`https://${blog.domain}/`);

            articles.forEach(article => {
                sitemap.add({
                    url: `https://${blog.domain}/${article.permlink}`,
                    changefreq: 'never',
                    lastmod: '1999-12-31' // TODO change to real datetime
                  });
            });

            res.header('Content-Type', 'application/xml');
            res.send( sitemap.xml );
           
        } catch (error) {
            if(error instanceof BlogNotExist) {
                return res.redirect('https://' + process.env.DOMAIN);
            }

            throw error;
        }
        
    }, req, res);
}

export default {
    middleware,
    handler
}