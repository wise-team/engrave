import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import { articleExists } from '../../../validators/steem/articleExists';
import { blogExists } from '../../../validators/blog/blogExiststs';
import validateBlogOwnership from '../../../services/blogs/actions/validateBlogOwnership';
import { draftExists } from '../../../validators/drafts/draftExists';
import postsService from '../../../services/posts/services.posts';
import validatePostOwnership from '../../../services/posts/actions/validatePostOwnership';
import getAccessToken from '../../../services/vault/actions/getAccessToken';
import prepareOperations from '../../../services/article/actions/prepareOperations';
import blogsService from '../../../services/blogs/services.blogs';
import { IDraft } from '../../../submodules/engrave-shared/interfaces/IDraft';
import { PostStatus } from '../../../submodules/engrave-shared/enums/PostStatus';
import sc from '../../../submodules/engrave-shared/services/steemconnect/steemconnect.service';

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
            draftId,
            title,
            body,
            thumbnail,
            categories,
            tags
        } = req.body;

        await validateBlogOwnership(blogId, username);

        if(draftId) {
            await validatePostOwnership(draftId, username);
        }
 
        if(await articleExists(username, permlink)) {
            throw new Error("Article with that permlink already exists");
        }

        const access_token = await getAccessToken(username);

        if(!access_token) {
            throw new Error("Could not authorize user (vault is sealed)");
        }

        const blog = await blogsService.getBlogByQuery({_id: blogId});

        const article: any = {
            blogId: blogId,
            created: new Date(),
            username: blog.owner,
            scheduled: null,
            title: title,
            body: body,
            categories: [],
            tags: ['test4'],
            featured_image: thumbnail,
            status: PostStatus.DRAFT,
            decline_reward: true,
            permlink: permlink,
            parent_category: null
        }
        
        const operations = prepareOperations(article, "publish", blog, {adopter: false});

        console.log(access_token);
                
        sc.dashboard.setAccessToken(access_token);
        const result = await sc.dashboard.broadcast(operations);

        console.log(result);
        
        if(draftId) {
            await postsService.removeWithQuery({_id: draftId});
        }

        return res.json({ status: "OK", result });

    }, req, res);
}

export default {
    middleware,
    handler
}