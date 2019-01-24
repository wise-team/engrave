import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';

import { isBlogAddressFree } from '../../../validators/isBlogAddressFree';

import blogsService from '../../../services/blogs/services.blogs';
import { INewBlog } from '../../../submodules/engrave-shared/interfaces/INewBlog';

const middleware: any[] =  [
    body('username').isString(), // check if username is the same as authenticated
    body('url').isString().isURL().custom(isBlogAddressFree).withMessage("This address is taken"), // isEngraveUrlValid
    body('title').isString(),
    
    // optional
    body('slogan').optional().isString(),
    body('theme').optional().isString(), // isThemeValid

    // prohibited
    body('_id').not().exists().withMessage('You tried to become a hacker, don\'t you?'),
    body('categories').not().exists().withMessage('To update categories, use another endpoint')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { 
            username, 
            url, 
            title, 
            slogan
        } = req.body;
        
        const blog: INewBlog = await blogsService.createBlogWithQuery({
            username, 
            url,
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