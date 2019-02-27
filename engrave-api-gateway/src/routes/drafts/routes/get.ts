import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';
import { draftExists } from '../../../validators/drafts/draftExists';
import postsService from '../../../services/posts/services.posts';
import validatePostOwnership from '../../../services/posts/actions/validatePostOwnership';

const middleware: any[] =  [
    param('id').isMongoId().custom(draftExists).withMessage("This draft does not exist")
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { id } = req.params;
        const { username } = res.locals;

        validatePostOwnership(id, username);

        const draft = await postsService.getWithQuery({_id: id});

        return res.json({ draft });

    }, req, res);
}

export default {
    middleware,
    handler
}