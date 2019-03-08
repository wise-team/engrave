import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';

import { isAddressFree } from '../../../validators/url/isAddressFree';

import blogsService from '../../../services/blogs/services.blogs';
import { isValidSubdomain } from '../../../validators/url/isValidSubdomain';
import { IBlog } from '../../../submodules/engrave-shared/interfaces/IBlog';
import { setBlog } from '../../../submodules/engrave-shared/services/cache/cache';

const middleware: any[] =  [
    body('url').isString()
        .isURL().withMessage("Please provide valid subdomain address")
        .custom(isValidSubdomain).withMessage("This is not proper subdomain")
        .custom(isAddressFree).withMessage("This address is taken"),
    body('title').isString(),
    
    // optional
    body('slogan').optional().isString(),
    body('theme').optional().isString(), // isThemeValid

    // prohibited
    body('adopter').not().exists().withMessage("Sorry, you are not an early adopter"),
    body('premium').not().exists().withMessage("You tried to become a hacker, don\'t you?"),
    body('_id').not().exists().withMessage('You tried to become a hacker, don\'t you?'),
    body('categories').not().exists().withMessage('To update categories, use another endpoint')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = res.locals;

        const {  
            url, 
            title, 
            slogan
        } = req.body;
        
        const blog = await blogsService.createBlogWithQuery({
            email: Math.random().toString(),
            owner: username, 
            url,
            title,
            slogan 
        });

        await setBlog(url, blog);

        return res.json( blog );

    }, req, res);
}

export default {
    middleware,
    handler
}