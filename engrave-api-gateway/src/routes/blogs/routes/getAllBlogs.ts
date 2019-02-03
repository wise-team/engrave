import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import blogsService from '../../../services/blogs/services.blogs';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { username } = res.locals;
        
        const blogs = await blogsService.getMultipleWithQuery({username: username});
        
        return res.json({ blogs });

    }, req, res);
}

export default {
    middleware,
    handler
}