import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        const { referer } = req.headers;
        return res.redirect( process.env.AUTH_SERVICE + '/blog?redirect=' + (referer ? referer : req.hostname))
    }, req, res);
}

export default {
    middleware,
    handler
}