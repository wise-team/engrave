import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import * as os from 'os';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { token } = req.headers;

        return res.json({
            message: 'pong',
            instance: os.hostname()
        });
    }, req, res);
}

export default {
    middleware,
    handler
}