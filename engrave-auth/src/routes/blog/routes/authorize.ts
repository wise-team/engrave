import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import sc from '../../../submodules/engrave-shared/services/steemconnect/steemconnect.service';
import jwt from '../../../services/jwt/jwt.service';
import { query } from 'express-validator/check';
import vault from '../../../services/vault/vault.service';

const middleware: any[] =  [
    query('code').isString()
];

async function handler(req: any, res: Response) {
    return handleResponseError(async () => {

        const { code } = req.query;
        const { redirect } = req.session;
       
        const { data: { access_token, username, expires_in} } = await sc.getRefreshToken(code, sc.blog.scope);
    
        await vault.storeAccessToken(username, access_token, false);

        const token = jwt.createJwt(username, jwt.Scope.BLOG);
        
        if(redirect) {
            const tokenString = encodeURIComponent(token);
            return res.redirect(redirect + '?jwt=' + tokenString);
        } else {
            return res.redirect('/');
        }

        
    }, req, res);
}

export default {
    middleware,
    handler
}