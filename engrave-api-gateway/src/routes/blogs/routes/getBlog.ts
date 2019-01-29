import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';

import blogsService from '../../../services/blogs/services.blogs';
import { blogExists } from '../../../validators/blogExiststs';

const middleware: any[] =  [
    param('id').isMongoId().custom(blogExists).withMessage('Blog does not exist')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { id } = req.params;
    
        const blog = await blogsService.getBlogByQuery({_id: id});

        return res.json({ blog });

    }, req, res);
}

export default {
    middleware,
    handler
}