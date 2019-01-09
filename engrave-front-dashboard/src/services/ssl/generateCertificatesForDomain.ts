
import axios from 'axios';
import { handleServiceError } from '../../submodules/engrave-shared';

export default async (domain: string) => {

    return handleServiceError(async () => {

       const options = {
            method: 'POST',
            data: {
                domain: domain,
            },
            url: "http://ssl:3000/ssl/generate"
        };
        
        return await axios(options);

    })
    
} 