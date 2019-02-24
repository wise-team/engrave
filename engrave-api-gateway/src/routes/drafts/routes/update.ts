import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import { draftExists } from '../../../validators/drafts/draftExists';
import postsService from '../../../services/posts/services.posts';

const middleware: any[] =  [
    body('id').isMongoId().custom(draftExists).withMessage("This draft does not exist"),
    
    body('title').optional().isString(),
    body('body').optional().isString(),

    body('thumbnail').optional().isURL(),
    
    body('scheduled').optional().isString(), // isDate
    body('categories').optional(), 
    body('tags').optional(),

    // prohibited
    body('username').not().exists().withMessage("Bad boy! You cannot change username"),
    body('status').not().exists().withMessage("Bad boy! You cannot change draft status"),
    body('_id').not().exists().withMessage("Bad boy! You tried to become a hacker, don\'t you?"),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { id } = req.body;
        const { username } = res.locals;

        let draft = await postsService.getWithQuery({_id: id});

        if(draft.username != username) throw new Error("You are not the owner of that draft!");

        await postsService.updateWithQuery(id, req.body);

        draft = await postsService.getWithQuery({_id: id});

        return res.json({ status: 'OK', draft });

    }, req, res);
}

export default {
    middleware,
    handler
}