import * as jwt from 'jsonwebtoken';
import * as httpCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

class VerificationError extends Error {

}

export default async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        if(!req.headers['authorization']) 
            throw new VerificationError('Auth token was not supplied');
        
        const token = (<string>req.headers['authorization']).replace("Bearer ", "");

        if( ! token) 
            throw new VerificationError('Unauthorized');
    
        const decodedToken: any = jwt.decode(token);

        if(decodedToken.proxy !== "engrave.app") 
            throw new VerificationError('Wrong proxy name');

        const currentTime = new Date().getTime() / 1000;
        
        if (decodedToken.exp < currentTime) 
            throw new VerificationError("Token expired");

        next();
        
    } catch (error) {
        if(error instanceof VerificationError) {
            return res.status(httpCodes.UNAUTHORIZED).json({message: error.message});
        } else {
            return res.status(httpCodes.UNAUTHORIZED).json({message: "Unauthorized"});
        }
    }
}