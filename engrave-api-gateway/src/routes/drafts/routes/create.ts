import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import postsService from '../../../services/posts/services.posts';
import { blogExists } from '../../../validators/blog/blogExiststs';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import validateCategories from '../../../services/categories/actions/validateCategories';

const middleware: any[] =  [
    body('blogId').isMongoId().custom(blogExists).withMessage('Blog does not exist'),
    body('title').isString().withMessage("Title cannot be empty"),
    body('body').isString().withMessage("Article body cannot be empty"),

    body('thumbnail').optional().isURL().withMessage("Invalid thumbnail URL"),
    body('decline_reward').optional().isBoolean().toBoolean(),
    
    body('scheduled').optional().isString(), // isDate
    body('categories').optional().isArray().withMessage("Categories need to be an array"),
    body('categories.*').optional().isMongoId().withMessage("Should be category ID"),
    body('tags').optional().isArray().withMessage("Tags need to be an array").custom(tags => (tags.length <= 5)).withMessage("Use no more than 5 tags"),
    body('tags.*').optional().matches(/^(?=.{2,24}$)([[a-z][a-z0-9]*-?[a-z0-9]+)$/).withMessage("Invalid Steem tag")

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
            decline_reward,
            tags
        } = req.body;
        
        await validateBlogOwnership(blogId, username);
        await validateCategories(categories, blogId);
        
        const post = await postsService.createDraft({
            blogId,
            username,
            title,
            body,
            thumbnail,
            scheduled,
            categories,
            decline_reward,
            tags
        });

        return res.json(post);

    }, req, res);
}

export default {
    middleware,
    handler
}