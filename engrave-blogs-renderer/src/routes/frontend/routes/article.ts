import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import cache from '../../../services/cache/cache';
import {BlogNotExist, ArticleNotFound} from '../../../helpers/errorCodes';

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {

    return handleResponseError(async () => {

        const {hostname} = req;
        const {permlink} = req.params;

        try {

            const blogger = await cache.getBlog(hostname);
            const article = await cache.getArticle(blogger.username, hostname, permlink);
            const featured = await cache.getFeatured(hostname, 5);
    
            return res.render('default/theme/single.pug', {
                blog: blogger,
                article: article,
                featured: featured
            });
           
        } catch (error) {
            if(error instanceof BlogNotExist) {
                return res.redirect('/');
            } else if(error instanceof ArticleNotFound) {            
    
                const blogger = await cache.getBlog(hostname);
                const featured = await cache.getFeatured(hostname, 10);

                return res.render('default/theme/404.pug', {
                    blog: blogger,
                    featured: featured
                });
            }

            throw error;
        }
        
    }, req, res);
}

export default {
    middleware,
    handler
}