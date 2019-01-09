import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { getBlog, getArticle, getFeaturedArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import { BlogNotExist, ArticleNotFound } from '../../../submodules/engrave-shared/helpers/errorCodes';

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {

    return handleResponseError(async () => {

        const {hostname} = req;
        const {permlink} = req.params;

        try {

            const blogger = await getBlog(hostname);
            const article = await getArticle(blogger.username, hostname, permlink);
            const featured = await getFeaturedArticles(blogger.username, 5);
    
            return res.render('default/theme/single.pug', {
                blog: blogger,
                article: article,
                featured: featured
            });
           
        } catch (error) {
            if(error instanceof BlogNotExist) {
                return res.redirect('https://' + process.env.DOMAIN);
            } else if(error instanceof ArticleNotFound) {            
    
                const blog = await getBlog(hostname);
                const featured = await getFeaturedArticles(blog.username, 10);

                return res.render('default/theme/404.pug', {
                    blog: blog,
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