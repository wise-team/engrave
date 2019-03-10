import axios from 'axios';
import { handleServiceError } from '../../../submodules/engrave-shared/hof/handleServiceError';

const getAccessToken = async (username: string, elevated: boolean) => {

    return handleServiceError(async () => {
    
        const options = {
            url: `http://vault-connector:3000/access/${username}/${elevated}`,
            method: 'GET'
        };
    
        const { data } = await axios(options);
    
        return data.token;
    
    })

}

export default getAccessToken;