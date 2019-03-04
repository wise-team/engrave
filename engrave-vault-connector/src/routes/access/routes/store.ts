import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param, body } from 'express-validator/check';
import vault from '../../../services/vault/vault.service';

const middleware: any[] =  [
   param("username").isString(),
   body("token").isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { username } = req.params;
        const { token } = req.body;

        await vault.storeAccessToken(username, token);

        return res.json({
            message: 'OK',
        });
    }, req, res);
}

export default {
    middleware,
    handler
}