import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import sc from '../../../services/steemconnect/steemconnect.service';
import { query } from 'express-validator/check';

const middleware: any[] =  [
    query('blog').isString().isURL()
];

async function handler(req: any, res: Response) {
    return handleResponseError(async () => {

        const { blog } = req.query;
        
        req.session.blog = blog;
 
        const url = sc.blog.getLoginURL() + '&response_type=code';

        return res.redirect( url );
        
    }, req, res);
}

export default {
    middleware,
    handler
}