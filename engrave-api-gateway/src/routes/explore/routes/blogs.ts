import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import blogsService from '../../../services/blogs/services.blogs';

const middleware: any[] =  [
    body('category').optional().isString().trim().escape(),
    body('skip').optional().isNumeric().trim().escape().toInt(),
    body('limit').optional().isNumeric().trim().escape().toInt()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { skip, category, limit } = req.body;
        
        const blogs = await blogsService.getLatestBlogsByCategory(category ? category : null, skip ? skip : 0, limit ? limit : 12);
        
        return res.json(blogs);

    }, req, res);
}

export default {
    middleware,
    handler
}