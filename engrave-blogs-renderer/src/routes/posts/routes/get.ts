import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { header } from 'express-validator/check';
import { getLatestFromCategory, getLatestArticles } from '../../../submodules/engrave-shared/services/cache/cache';

const middleware: any[] =  [
    header('username').isString(),
    header('skip').optional().isNumeric(),
    header('category').optional().isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const {username, skip, category} = req.headers;
        
        let posts:any = [];

        if(category) {
            posts = await getLatestFromCategory(<string>category, <string>username, skip ? parseInt(<string>skip) : 0, 12);
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