import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import postsService from '../../../services/posts/services.posts';
import { blogExists } from '../../../validators/blog/blogExiststs';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';

const middleware: any[] =  [
    body('blogId').isMongoId().custom(blogExists).withMessage('Blog does not exist'),
    body('title').isString(),
    body('body').isString(),

    body('thumbnail').optional().isURL(),
    
    body('scheduled').optional().isString(), // isDate
    body('categories').optional(), 
    body('tags').optional(),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = res.locals;

        
        const {
            blogId,
            title,
            body,
            thumbnail,
            scheduled,
            categories,
            tags
        } = req.body;
        
        validateBlogOwnership(blogId, username);
        
        const post = await postsService.createDraft({
            blogId,
            username,
            title,
            body,
            thumbnail,
            scheduled,
            categories,
            tags
        });

        return res.json({ post });

    }, req, res);
}

export default {
    middleware,
    handler
}