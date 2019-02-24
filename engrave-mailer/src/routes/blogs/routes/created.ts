import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import mail from '../../../services/mail/mail';
import preparator from '../../../services/preparator/preparator';

const middleware: any[] =  [
    body('email').isEmail(),
    body('username').isString().isLength({min:2, max: 24}),
    body('domain').isURL()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { email, username, domain } = req.body;

        console.log("New blog created mail sent");
        
        await mail.send(email, "New blog created", preparator.blogCreated(username, domain));
        
        return res.json({
            status: 'OK'
        });

    }, req, res);
}

export default {
    middleware,
    handler
}