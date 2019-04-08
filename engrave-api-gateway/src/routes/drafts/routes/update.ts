import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body, param} from 'express-validator/check';
import { draftExists } from '../../../validators/drafts/draftExists';
import postsService from '../../../services/posts/services.posts';
import validatePostOwnership from '../../../services/posts/actions/validatePostOwnership';

const middleware: any[] =  [
    param('id').isMongoId().custom(draftExists).withMessage("This draft does not exist"),
    
    body('title').optional().isString(),
    body('body').optional().isString(),

    body('thumbnail').optional().isURL(),
    
    body('scheduled').optional().isString(), // isDate
    body('categories').optional().isArray().withMessage("Categories need to be an array"),
    body('categories.*').optional().isMongoId().withMessage("Should be category ID"),
    body('tags').optional().isArray().withMessage("Tags need to be an array").custom(tags => (tags.length <= 5)).withMessage("Use no more than 5 tags"),
    body('tags.*').optional().matches(/^(?=.{2,24}$)([[a-z][a-z0-9]*-?[a-z0-9]+)$/).withMessage("Invalid Steem tag"),
    body('decline_reward').optional().isBoolean().toBoolean(),

    // prohibited
    body('username').not().exists().withMessage("Bad boy! You cannot change username"),
    body('status').not().exists().withMessage("Bad boy! You cannot change draft status"),
    body('_id').not().exists().withMessage("Bad boy! You tried to become a hacker, don\'t you?"),
    body('blogId').not().exists().withMessage("Bad boy! You tried to become a hacker, don\'t you?")
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { id } = req.params;
        const { username } = res.locals;

        // todo validate categories
        await validatePostOwnership(id, username);

        await postsService.updateWithQuery(id, req.body);

        const draft = await postsService.getWithQuery({_id: id});

        return res.json(draft);

    }, req, res);
}

export default {
    middleware,
    handler
}