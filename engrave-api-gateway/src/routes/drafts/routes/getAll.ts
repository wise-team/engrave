import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { header } from 'express-validator/check';
import postsService from '../../../services/posts/services.posts';
import { blogExists } from '../../../validators/blog/blogExiststs';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import { PostStatus } from '../../../submodules/engrave-shared/enums/PostStatus';

const middleware: any[] =  [
    header('blog_id').isString().isMongoId().custom(blogExists).withMessage('Blog does not exist'),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = res.locals;
        const { blog_id } = req.headers;
        
        await validateBlogOwnership(<string>blog_id, username);

        const posts = await postsService.getMultipleWithQuery( { 
            username: username, 
            blogId: blog_id,
            status: PostStatus.DRAFT 
        });

        return res.json(posts);

    }, req, res);
}

export default {
    middleware,
    handler
}