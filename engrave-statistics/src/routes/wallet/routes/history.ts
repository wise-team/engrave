import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import { Statistics } from '../../../models/StatisticsModel';

const middleware: any[] =  [
    body('username').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const history = await Statistics
            .find({ steem_username: req.body.username })
            .slice('savings_sbd', -30)
            .slice('savings_steem', -30)
            .slice('sbd', -30)
            .slice('steem', -30)
            .slice('steem_power', -30)
            .exec();
            
        return res.json(
            history[0]
        );
    }, req, res);
}

export default {
    middleware,
    handler
}