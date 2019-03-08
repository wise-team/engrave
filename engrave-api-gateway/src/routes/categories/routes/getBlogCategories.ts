import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';

import { blogExists } from '../../../validators/blog/blogExiststs';
import categoriesService from '../../../services/categories/categories.service';
import { ICategory } from '../../../submodules/engrave-shared/interfaces/ICategory';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';

const middleware: any[] =  [
    param('blogId').isMongoId().custom(blogExists).withMessage('Blog does not exist')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { blogId } = req.params;
        const { username } = res.locals;
        
        await validateBlogOwnership(blogId, username);
    
        const categories: ICategory[] = await categoriesService.getCategoriesByBlogId(blogId);

        return res.json( categories );

    }, req, res);
}

export default {
    middleware,
    handler
}