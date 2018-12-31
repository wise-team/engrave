import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import validateDomainCertificates from '../../../services/validateDomainCertificates';
import { body } from 'express-validator/check';

const middleware: any[] =  [
    body('domain').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const { domain } = req.body;

        return res.json({
            domain: domain,
            ssl_exists: validateDomainCertificates(domain)
        });
    }, req, res);
}

export default {
    middleware,
    handler
}