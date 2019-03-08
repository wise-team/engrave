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

            const blog = await getBlog(hostname);

            if(blog.domain_redirect && hostname != blog.custom_domain) {
                return res.redirect('https://' + blog.custom_domain);
            }

            const article = await getArticle(blog._id, permlink);
            const featured = await getFeaturedArticles(blog._id, 0, 10);
        
            return res.render(`${blog.theme}/theme/single.pug`, {
                blog: blog,
                article: article,
                featured: featured
            });
           
        } catch (error) {
            if(error instanceof BlogNotExist) {
                return res.redirect('https://' + process.env.DOMAIN);
            } else if(error instanceof ArticleNotFound) {            
    
                const blog = await getBlog(hostname);
                const featured = await getFeaturedArticles(blog._id, 0, 10);

                return res.render(`${blog.theme}/theme/404.pug`, {
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