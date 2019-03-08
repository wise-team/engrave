import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { getBlog } from '../../../submodules/engrave-shared/services/cache/cache';
import sitemap from '../../../services/sitemap/sitemap.service';

const middleware: any[] =  [];

async function handler(req: Request, res: Response) {

    return handleResponseError(async () => {

        const { hostname } = req;

        const blog = await getBlog(hostname);
        
        if(blog.domain_redirect && hostname != blog.custom_domain) {
            return res.redirect('https://' + blog.custom_domain);
        }

        const xml = await sitemap.getSitemap(blog);

        res.header('Content-Type', 'application/xml');
        return res.send(xml);
        
    }, req, res);
}

export default {
    middleware,
    handler
}