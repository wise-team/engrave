import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';

import blogsService from '../../../services/blogs/services.blogs';
import { blogExists } from '../../../validators/blogExiststs';

const middleware: any[] =  [
    body('id').isString().custom(blogExists).withMessage('Blog does not exist')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { id } = req.body;
        
        await blogsService.removeBlogWithQuery({_id: id});
        
        return res.json({ 
            success: 'OK'
         });

    }, req, res);
}

export default {
    middleware,
    handler
}