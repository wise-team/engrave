import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { body } from 'express-validator/check';
import jwt from '../../../services/jwt/jwt.service';

const middleware: any[] =  [
    body('token').isString()
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {
        
        const { token } = req.body;
        
        const {data, iat, exp} = jwt.validateJwt(token);

        return res.json({
            valid: true,
            payload: {data}, 
            iat, 
            exp
        })

    }, req, res);
}

export default {
    middleware,
    handler
}