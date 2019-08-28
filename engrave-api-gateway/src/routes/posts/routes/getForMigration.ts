import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import getForMigration from '../../../submodules/engrave-shared/services/cache/actions/articles/getForMigration';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
    
        const posts = await getForMigration();
        
        return res.json(posts);

    }, req, res);
}

export default {
    middleware,
    handler
}