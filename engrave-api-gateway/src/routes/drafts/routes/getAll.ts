import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import postsService from '../../../services/posts/services.posts';
import { PostStatus } from '../../../models/EPostStatus';
import { blogExists } from '../../../validators/blog/blogExiststs';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';

const middleware: any[] =  [
    body('username').isString(),
    body('blogId').isMongoId().custom(blogExists).withMessage('Blog does not exist'),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username, blogId} = req.body;
        
        validateBlogOwnership(blogId, username);

        const posts = await postsService.getMultipleWithQuery( { 
            username: username, 
            blogId: blogId,
            status: PostStatus.DRAFT 
        });

        return res.json(posts);

    }, req, res);
}

export default {
    middleware,
    handler
}