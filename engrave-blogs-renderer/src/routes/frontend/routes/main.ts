import { Request, Response } from 'express';
import { getBlog, getLatestArticles, getFeaturedArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import { BlogNotExist } from '../../../submodules/engrave-shared/helpers/errorCodes';
const dynamicStatic = require('express-dynamic-static')();

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {
    
    const {hostname} = req;
    
    try {
        
        const blog = await getBlog(hostname);
        const latest = await getLatestArticles(blog.username, 0);
        const featured = await getFeaturedArticles(blog.username, 0);

        dynamicStatic.setPath(`/app/src/themes/${blog.theme}/public`);
        
        return res.render(`${blog.theme}/theme/index.pug`, {
            blog: blog,
            latest: latest,
            featured: featured
        });
        
    } catch(error) {
        if(error instanceof BlogNotExist) {
            return res.redirect('https://' + process.env.DOMAIN);
        } else {
            return res.redirect('/');
        }
    }
}

export default {
    middleware,
    handler
}