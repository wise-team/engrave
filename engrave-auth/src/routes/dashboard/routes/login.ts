import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import sc from '../../../services/steemconnect/steemconnect.service';
import { query } from 'express-validator/check';

const middleware: any[] =  [
];

async function handler(req: any, res: Response) {
    return handleResponseError(async () => {

        const url = sc.dashboard.getLoginURL() + '&response_type=code';

        return res.redirect( url );
        
    }, req, res);
}

export default {
    middleware,
    handler
}