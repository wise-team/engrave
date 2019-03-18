
import axios from 'axios';
import { handleServiceError } from '../../submodules/engrave-shared';

export default async (email: string, username: string, domain: string) => {

    return handleServiceError(async () => {

       const options = {
            method: 'POST',
            data: {
                email,
                username,
                domain,
            },
            url: "http://mailer:3000/registration/confirm"
        };
        
        return await axios(options);

    })
    
} 