import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import sc from '../../../submodules/engrave-shared/services/steemconnect/steemconnect.service';
import vault from '../../../services/vault/vault.service';
import jwt from '../../../services/jwt/jwt.service';
import { query } from 'express-validator/check';
import { setUserRegistered } from '../../../submodules/engrave-shared/services/cache/cache';

const middleware: any[] =  [
    query('code').isString()
];

async function handler(req: any, res: Response) {
    return handleResponseError(async () => {

        const { code } = req.query;
       
        const { data: { access_token, refresh_token, username, expires_in} } = await sc.getRefreshToken(code, sc.dashboard.scope);
    
        await vault.storeRefreshToken(username, refresh_token);
        await vault.storeAccessToken(username, access_token);

        const token = jwt.createJwt(username, jwt.Scope.DASHBBOARD);

        await setUserRegistered(username);
        
        const tokenString = encodeURIComponent(token);
        return res.redirect(process.env.DASHBOARD_ADDR + '?jwt=' + tokenString);
        
    }, req, res);
}

export default {
    middleware,
    handler
}