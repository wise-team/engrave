import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import generateCertificate from '../../../services/generateCertificate';

const middleware: any[] =  [
    body('domain').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { domain } = req.body;

        await generateCertificate(domain);

        return res.json({
            domain: domain,
            status: "success"
        });
    }, req, res);
}

export default {
    middleware,
    handler
}