import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param, body } from 'express-validator/check';
import vault from '../../../services/vault/vault.service';

const middleware: any[] =  [
   param("username").isString(),
   param("elevated").isBoolean(),
   body("token").isString(),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        console.log('access/store', new Date());

        const { token } = req.body;
        const { username } = req.params;
        const elevated = (req.params.elevated == 'true');

        await vault.storeAccessToken(username, token, elevated);

        return res.json({
            message: 'OK',
        });
    }, req, res);
}

export default {
    middleware,
    handler
}