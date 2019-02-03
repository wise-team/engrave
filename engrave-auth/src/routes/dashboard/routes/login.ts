import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import sc from '../../../submodules/engrave-shared/services/steemconnect/steemconnect.service';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const url = sc.dashboard.getLoginURL() + '&response_type=code';

        return res.redirect( url );
        
    }, req, res);
}

export default {
    middleware,
    handler
}