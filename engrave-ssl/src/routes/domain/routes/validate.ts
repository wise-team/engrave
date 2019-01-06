import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import checkIfDomainPointsEngraveServer from '../../../services/checkIfDomainPointsEngraveServer';

const middleware: any[] =  [
    body('domain').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { domain } = req.body;

        return res.json({
            domain: domain,
            is_pointing: await checkIfDomainPointsEngraveServer(domain)
        });
    }, req, res);
}

export default {
    middleware,
    handler
}