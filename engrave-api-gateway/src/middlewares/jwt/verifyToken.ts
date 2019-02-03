import * as jwt from 'jsonwebtoken';
import * as httpCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
const secrets = require('@cloudreach/docker-secrets');

class VerificationError extends Error {

}

export default async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        if(!req.headers['authorization']) 
            throw new VerificationError('Auth token was not supplied');
        
        const token = (<string>req.headers['authorization']).replace("Bearer ", "");

        if( ! token)
            throw new VerificationError('Unauthorized');
    
        const payload: any = jwt.verify(token, secrets.JWT_SECRET);

        if(payload.data.platform !== "engrave.website")
            throw new VerificationError('Wrong platform name');
        
        if(payload.data.scope !== "dashboard")
            throw new VerificationError('Invalid scope');

        if( ! payload.data.username) 
            throw new VerificationError('Missing username');

        const currentTime = new Date().getTime() / 1000;
        
        if (payload.exp < currentTime)
            throw new VerificationError("Token expired");

        res.locals.username = payload.data.username;

        next();
        
    } catch (error) {
        if(error instanceof VerificationError) {
            return res.status(httpCodes.UNAUTHORIZED).json({message: error.message});
        } else {
            return res.status(httpCodes.UNAUTHORIZED).json({message: "Unauthorized"});
        }
    }
}