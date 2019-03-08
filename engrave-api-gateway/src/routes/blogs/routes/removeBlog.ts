import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';

import blogsService from '../../../services/blogs/services.blogs';
import { blogExists } from '../../../validators/blog/blogExiststs';
import { removeBlog } from '../../../submodules/engrave-shared/services/cache/cache';

const middleware: any[] = [
    body('id').isString().custom(blogExists).withMessage('Blog does not exist')
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { id } = req.body;
        const { username } = res.locals;

        const blog = await blogsService.getBlogByQuery({ _id: id });

        if (blog.owner != username) throw new Error('You are not the owner of that blog!');

        await removeBlog(blog.domain)
        if(blog.custom_domain) {
            await removeBlog(blog.custom_domain)
        }

        await blogsService.removeBlogWithQuery({ _id: id });

        return res.json({
            success: 'OK'
        });

    }, req, res);
}

export default {
    middleware,
    handler
}