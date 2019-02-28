import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body, header } from 'express-validator/check';
import auth from '../../../services/auth/auth';
import sc from '../../../submodules/engrave-shared/services/steemconnect/steemconnect.service';
import vault from '../../../services/vault/vault.service';
import renderSteemCommentBody from '../../../submodules/engrave-shared/services/article/renderSteemCommentBody';

const middleware: any[] =  [
    body('parent_author').isString(),
    body('parent_permlink').isString(),
    body('parent_title').isString(),
    body('body').isString(),
    
    header('authorization').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { authorization: token } = req.headers;
        const { parent_author, parent_permlink, parent_title, body } = req.body;

        const {valid, payload: {data: { username }}} = await auth.validateJwt(token);

        if(!valid) throw new Error("JWT not valid")

        const access_token = await vault.getAccessToken(username);

        const result = await sc.comment(access_token, username, parent_title, body, parent_author, parent_permlink);

        console.log(`Comment added successfully by: ${username} at ${parent_author}, ${parent_permlink}`);

        return res.json({
            success: 'Comment added successfully',
            body,
            rendered: await renderSteemCommentBody(body),
            author: username,
            result
        });

    }, req, res);
}

export default {
    middleware,
    handler
}