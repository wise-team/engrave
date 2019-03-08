import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';

import { isAddressFree } from '../../../validators/url/isAddressFree';

import blogsService from '../../../services/blogs/services.blogs';
import { isValidSubdomain } from '../../../validators/url/isValidSubdomain';
import { setBlog } from '../../../submodules/engrave-shared/services/cache/cache';
import { IBlog } from '../../../submodules/engrave-shared/interfaces/IBlog';

const middleware: any[] =  [
    body('domain').isString()
        .isURL().withMessage("Please provide valid subdomain address")
        .custom(isValidSubdomain).withMessage("This is not proper subdomain")
        .custom(isAddressFree).withMessage("This address is taken"),
    body('title').isString(),
    
    // optional
    body('slogan').optional().isString(),
    body('theme').optional().isString(), // isThemeValid

    // prohibited
    body('premium').not().exists().withMessage("You tried to become a hacker, don\'t you?"),
    body('owner').not().exists().withMessage('You tried to become a hacker, don\'t you?'),
    body('_id').not().exists().withMessage('You tried to become a hacker, don\'t you?'),
    body('categories').not().exists().withMessage('To update categories, use another endpoint')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = res.locals;

        const {  
            domain, 
            title, 
            slogan
        } = req.body;
        
        const blog: IBlog = await blogsService.createBlogWithQuery({
            email: Math.random().toString(),
            owner: username, 
            domain,
            title,
            slogan 
        });

        await setBlog(blog);

        return res.json( blog );

    }, req, res);
}

export default {
    middleware,
    handler
}