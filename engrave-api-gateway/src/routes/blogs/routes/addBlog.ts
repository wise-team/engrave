import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';

import blogsService from '../../../services/blogs/services.blogs';
import { INewBlog } from '../../../submodules/engrave-shared/interfaces/INewBlog';

const middleware: any[] =  [
    body('username').isString(),
    body('domain').isString(),
    body('title').isString(),
    body('slogan').isString(),

    body('theme').optional().isString() // isThemeValid
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { 
            username, 
            domain, 
            title, 
            slogan
        } = req.body;
        
        const blog: INewBlog = await blogsService.createBlogWithQuery({
            username, 
            domain,
            title,
            slogan 
        })

        return res.json({ blog });

    }, req, res);
}

export default {
    middleware,
    handler
}