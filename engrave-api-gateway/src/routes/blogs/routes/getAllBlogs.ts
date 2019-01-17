import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';

import blogsService from '../../../services/blogs/services.blogs';

const middleware: any[] =  [
    param('username').isString(),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = req.params;
        
        const blogs = await blogsService.getMultipleWithQuery({username: username});
        
        return res.json({ blogs });

    }, req, res);
}

export default {
    middleware,
    handler
}