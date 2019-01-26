import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import * as os from 'os';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        return res.redirect('https://' + process.env.DOMAIN + '/blog')
    }, req, res);
}

export default {
    middleware,
    handler
}