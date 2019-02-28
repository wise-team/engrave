import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import renderSteemCommentBody from '../../../submodules/engrave-shared/services/article/renderSteemCommentBody';
const steem = require('steem');
var md = require('markdown-it')({ linkify: true });

const middleware: any[] =  [
    body('author').isString(),
    body('permlink').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const {author, permlink} = req.body;
        
        const rawReplies = await steem.api.getContentRepliesAsync( author, permlink);

        const results = rawReplies.map( async (comment: any) => {
            comment.rendered = await renderSteemCommentBody(comment.body);
            return comment;
        })

        Promise.all(results).then(replies => {
            return res.json(replies);
        })

    }, req, res);
}

export default {
    middleware,
    handler
}