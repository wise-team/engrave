import axios from 'axios';
import { handleServiceError } from '../../../submodules/engrave-shared';

export default async (username: string) => {
   
    return handleServiceError(async () => {
    
        const options = {
            url: "http://vault-connector:3000/access/" + username,
            method: 'GET',
        };
    
        const { data } = await axios(options);
    
        return data.token;
    
    })

}