import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';
import vault from '../../../services/vault/vault.service';

const middleware: any[] =  [
   param("username").isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { username } = req.params;

        const token: string = await vault.getAccessToken(username);

        return res.json({
            message: "OK",
            token: token
        });
    }, req, res);
}

export default {
    middleware,
    handler
}