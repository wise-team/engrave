import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import { articleExists } from '../../../validators/steem/articleExists';
import { blogExists } from '../../../validators/blog/blogExiststs';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import { draftExists } from '../../../validators/drafts/draftExists';
import postsService from '../../../services/posts/services.posts';
import validatePostOwnership from '../../../services/posts/actions/validatePostOwnership';

const middleware: any[] =  [
    body('blogId').isMongoId().custom(blogExists).withMessage('Blog does not exist'),
    
    body("permlink").isString().isLength({min: 2, max: 84}),
    body('title').isString(),
    body('body').isString(),
    body('thumbnail').optional().isURL(),
    body('categories').optional(),
    body('tags').optional(),
    
    body('draftId').optional().isMongoId().custom(draftExists).withMessage('Draft does not exist'),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { username } = res.locals;
        
        const { 
            blogId, 
            permlink,
            draftId
        } = req.body;

        await validateBlogOwnership(blogId, username);

        if(draftId) {
            await validatePostOwnership(draftId, username);
        }
 
        if(await articleExists(username, permlink)) {
            throw new Error("Article with that title already exists");
        }

        // TODO publish here

        if(draftId) {
            await postsService.removeWithQuery({_id: draftId});
        }

        return res.json({ status: "OK" });

    }, req, res);
}

export default {
    middleware,
    handler
}