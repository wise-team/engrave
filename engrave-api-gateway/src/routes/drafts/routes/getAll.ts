import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';
import { getLatestFromCategory, getLatestArticles } from '../../../submodules/engrave-shared/services/cache/cache';
import { draftExists } from '../../../validators/drafts/draftExists';

const middleware: any[] =  [
    param('id').isMongoId().custom(draftExists).withMessage("This draft does not exist")
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const {username, skip, category} = req.headers;
        
        let posts:any = [];

        if(category) {
            posts = await getLatestFromCategory(<string>category, <string>username, skip ? parseInt(<string>skip) : 0);
        } else {
            posts = await getLatestArticles(<string>username, skip ? parseInt(<string>skip) : 0);
        }
        
        return res.json({ posts });

    }, req, res);
}

export default {
    middleware,
    handler
}