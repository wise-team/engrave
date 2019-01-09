import { Request, Response } from 'express';
import { getBlog, getLatestArticles, getFeaturedArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import { BlogNotExist } from '../../../submodules/engrave-shared/helpers/errorCodes';

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {
    
    const {hostname} = req;
    
    try {
        
        const blog = await getBlog(hostname);
        const latest = await getLatestArticles(blog.username, 10);
        const featured = await getFeaturedArticles(blog.username, 10);

        // dynamicStatic.setPath(path.resolve(__dirname, 'path/to/app/assets'));
        
        return res.render('default/theme/index.pug', {
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