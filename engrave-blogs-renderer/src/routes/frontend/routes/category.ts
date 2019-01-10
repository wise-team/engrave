import { Request, Response } from 'express';
import { getBlog, getLatestFromCategory, getFeaturedArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import { BlogNotExist } from '../../../submodules/engrave-shared/helpers/errorCodes';
const dynamicStatic = require('express-dynamic-static')();

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {
    
    const {hostname} = req;
    const {slug} = req.params;
    
    try {
        
        const blog = await getBlog(hostname);
        const latest = await getLatestFromCategory(slug, blog.username, 10);
        const featured = await getFeaturedArticles(blog.username, 10);
        let category = blog.categories.find( category => category.slug == slug);
      
        if(!category) {
            category = {
                steem_tag: slug,
                name: slug,
                slug: slug
            }
        }

        dynamicStatic.setPath(`/app/src/themes/${blog.theme}/public`);
        
        return res.render(`${blog.theme}/theme/category.pug`, {
            blog: blog,
            latest: latest,
            featured: featured, 
            category: category
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