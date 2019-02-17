import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import * as os from 'os';
import { body } from 'express-validator/check';
import mail from '../../../services/mail/mail';

const middleware: any[] =  [
    body('email').isEmail()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { email } = req.body;

        await mail.send(email, "Registration", "This is registration email");
        
        return res.json({
            status: 'OK'
        });
        
    }, req, res);
}

export default {
    middleware,
    handler
}