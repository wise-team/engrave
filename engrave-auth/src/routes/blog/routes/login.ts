import { Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import sc from '../../../services/steemconnect/steemconnect.service';
import { query } from 'express-validator/check';

const middleware: any[] =  [
    query('redirect').isString().isURL()
];

async function handler(req: any, res: Response) {
    return handleResponseError(async () => {

        const { redirect } = req.query;
        
        req.session.redirect = redirect;
 
        const url = sc.blog.getLoginURL() + '&response_type=code';

        return res.redirect( url );
        
    }, req, res);
}

export default {
    middleware,
    handler
}