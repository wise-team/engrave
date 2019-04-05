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
import { OperationsScope } from '../../../submodules/engrave-shared/enums/OperationsScope';
import validateCategories from '../../../services/categories/actions/validateCategories';

const middleware: any[] =  [
    body('blogId').isMongoId().custom(blogExists).withMessage('Blog does not exist'),
    
    body("permlink").isString().isLength({min: 2, max: 84}),
    body('title').isString(),
    body('body').isString(),
    body('thumbnail').optional().isURL(),
    body('categories').optional().isArray().withMessage("Categories need to be an array"),
    body('categories.*').optional().isMongoId().withMessage("Should be category ID"),
    body('tags').optional().isArray().withMessage("Tags need to be an array").custom(tags => (tags.length <= 5)).withMessage("Use no more than 5 tags"),
    body('tags.*').optional().matches(/^(?=.{2,24}$)([[a-z][a-z0-9]*-?[a-z0-9]+)$/).withMessage("Invalid Steem tag"),
    
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
            decline_reward,
            tags
        } = req.body;

        await validateBlogOwnership(blogId, username);
        await validateCategories(categories, blogId);
        await validatePostOwnership(draftId, username);
 
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
            categories: categories,
            tags: tags,
            featured_image: thumbnail,
            thumbnail_image: thumbnail,
            status: PostStatus.DRAFT,
            decline_reward: decline_reward,
            permlink: permlink,
            parent_category: null
        }
        
        const operations = prepareOperations(article, OperationsScope.PUBLISH , blog, {adopter: false});

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