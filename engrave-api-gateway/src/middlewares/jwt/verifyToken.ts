import * as jwt from 'jsonwebtoken';
import * as httpCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
const secrets = require('@cloudreach/docker-secrets');

class VerificationError extends Error {

}

export default async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        if(!req.headers['authorization']) throw new VerificationError('Auth token was not supplied');
        
        const token = (<string>req.headers['authorization']).replace("Bearer ", "");

        if(!token) throw new VerificationError('Unauthorized');
    
        const decodedToken: any = jwt.verify(token, secrets.JWT_TOKEN);

        if(decodedToken.platform !== "engrave.website") throw new VerificationError('Wrong platform name');
        
        if(decodedToken.scope !== "dashboard") throw new VerificationError('Invalid scope');

        const currentTime = new Date().getTime() / 1000;
        
        if (decodedToken.exp < currentTime) throw new VerificationError("Token expired");

        next();
        
    } catch (error) {
        if(error instanceof VerificationError) {
            return res.status(httpCodes.UNAUTHORIZED).json({message: error.message});
        } else {
            return res.status(httpCodes.UNAUTHORIZED).json({message: "Unauthorized"});
        }
    }
}