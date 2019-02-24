import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';
import { draftExists } from '../../../validators/drafts/draftExists';
import postsService from '../../../services/posts/services.posts';

const middleware: any[] =  [
    param('id').isMongoId().custom(draftExists).withMessage("This draft does not exist")
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { id } = req.params;
        const { username } = res.locals;

        const draft = await postsService.getWithQuery({_id: id});

        if(draft.username != username) throw new Error("You are not the owner of that draft!");

        await postsService.removeWithQuery({_id: id});

        return res.json({ 
            success: 'OK'
         });

    }, req, res);
}

export default {
    middleware,
    handler
}