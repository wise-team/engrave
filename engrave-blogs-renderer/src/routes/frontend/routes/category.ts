import { Request, Response } from 'express';
import { getBlog, getLatestFromCategory, getFeaturedArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import { BlogNotExist } from '../../../submodules/engrave-shared/helpers/errorCodes';

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {
    
    const {hostname} = req;
    const {slug} = req.params;
    
    try {
        
        const blog = await getBlog(hostname);
        const latest = await getLatestFromCategory('asd', blog._id, 0, 12);
        const featured = await getFeaturedArticles(blog._id, 0, 10);
        const category = blog.categories.find( category => category.slug == slug);
      
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