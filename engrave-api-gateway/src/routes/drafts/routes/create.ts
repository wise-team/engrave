import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import postsService from '../../../services/posts/services.posts';

const middleware: any[] =  [
    body('title').isString(),
    body('body').isString(),

    body('thumbnail').optional().isURL(),
    
    body('scheduled').optional().isString(), // isDate
    body('categories').optional(), 
    body('tags').optional(),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = res.locals;

        const {
            title,
            body,
            thumbnail,
            scheduled,
            categories,
            tags
        } = req.body;
       
        const post = await postsService.createDraft({
            username,
            title,
            body,
            thumbnail,
            scheduled,
            categories,
            tags
        });

        return res.json({ post });

    }, req, res);
}

export default {
    middleware,
    handler
}