import { Request, Response } from 'express';
import cache from '../../../services/cache/cache';

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {
    
    const {hostname} = req;
    
    try {
        
        const blog = await cache.getBlog(hostname);
        const latest = await cache.getLatest(blog.username, 10);
        const featured = await cache.getFeatured(blog.username, 10);

        // dynamicStatic.setPath(path.resolve(__dirname, 'path/to/app/assets'));
        
        return res.render('default/theme/index.pug', {
            blog: blog,
            latest: latest,
            featured: featured
        });
        
    } catch(error) {
        res.redirect('/');
    }
}

export default {
    middleware,
    handler
}