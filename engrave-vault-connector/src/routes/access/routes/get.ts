import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { param } from 'express-validator/check';
import vault from '../../../services/vault/vault.service';

const middleware: any[] = [
    param("username").isString(),
    param("elevated").isBoolean(),
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        console.log('access/get', new Date());
        const { username } = req.params;
        const elevated = (req.params.elevated == 'true');

        const token: string = await vault.getAccessToken(username, elevated);

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