import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import { blogExists } from '../../../validators/blogExiststs';

const middleware: any[] =  [
    body('domain').not().exists().withMessage("Domain cannot be changed"),

    body('id').isString().custom(blogExists).withMessage('Blog does not exist')

];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        return res.json({ status: 'not implemented' });

    }, req, res);
}

export default {
    middleware,
    handler
}