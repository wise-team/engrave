import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import postsService from '../../../services/posts/services.posts';
import { PostStatus } from '../../../models/EPostStatus';

const middleware: any[] =  [
    body('username').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = req.body;
        
        const posts = await postsService.getMultipleWithQuery( { 
            username: username, 
            status: PostStatus.DRAFT 
        });

        return res.json(posts);

    }, req, res);
}

export default {
    middleware,
    handler
}