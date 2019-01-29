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
    
        const decodedToken: any = jwt.verify(token, secrets.JWT_SECRET);

        if(decodedToken.data.platform !== "engrave.website")
            throw new VerificationError('Wrong platform name');
        
        if(decodedToken.data.scope !== "dashboard")
            throw new VerificationError('Invalid scope');

        if( ! decodedToken.data.username) 
            throw new VerificationError('Missing username');

        const currentTime = new Date().getTime() / 1000;
        
        if (decodedToken.exp < currentTime)
            throw new VerificationError("Token expired");

        res.locals.username = decodedToken.data.username;

        next();
        
    } catch (error) {
        if(error instanceof VerificationError) {
            return res.status(httpCodes.UNAUTHORIZED).json({message: error.message});
        } else {
            return res.status(httpCodes.UNAUTHORIZED).json({message: "Unauthorized"});
        }
    }
}