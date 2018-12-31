import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import generateNginxSettings from '../../../services/nginx/generateSettings';

const middleware: any[] =  [
    body('domain').isString(),
    body('port').isNumeric(),
    body('is_domain_custom').isBoolean()
];

async function handler(req: Request, res: Response) {

    return handleResponseError(async () => {

        const { 
            domain, 
            port, 
            is_domain_custom 
        } = req.body;

        await generateNginxSettings(domain, port, is_domain_custom);
        
        return res.json({
            message: 'success'
        });

    }, req, res);

}

export default {
    middleware,
    handler
}