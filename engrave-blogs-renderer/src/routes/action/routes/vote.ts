import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import * as os from 'os';
import { body, header } from 'express-validator/check';
import auth from '../../../services/auth/auth';
import vault from '../../../services/vault/vault.service';
import sc from '../../../submodules/engrave-shared/services/steemconnect/steemconnect.service';

const middleware: any[] =  [
    body('author').isString(),
    body('permlink').isString(),
    body('weight').isNumeric(),

    header('authorization').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { authorization: token } = req.headers;
        const { author, permlink, weight } = req.body;

        const {valid, payload: {data: { username }}} = await auth.validateJwt(token);

        if(!valid) throw new Error("JWT not valid")

        const access_token = await vault.getAccessToken(username);

        const result = await sc.vote(access_token, username, author, permlink, parseInt(weight));

        console.log(`Voted successfully by: ${username} at ${author}, ${permlink}`);

        return res.json({
            success: 'Voted successfully',
            author: username,
            result
        });

    }, req, res);
}

export default {
    middleware,
    handler
}