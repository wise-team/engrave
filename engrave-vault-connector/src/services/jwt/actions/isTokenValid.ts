import * as jwt from 'jsonwebtoken';

export default async (token: string) => {

    try {

        const payload: any = jwt.decode(token);

        const currentTime = new Date().getTime() / 1000;

        if (payload.exp < currentTime) {
            throw new Error("Token expired");
        }
        
        return true;

    } catch (error) {
        return false;
    }

}