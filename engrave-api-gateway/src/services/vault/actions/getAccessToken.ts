import axios from 'axios';
import { handleServiceError } from '../../../submodules/engrave-shared/hof/handleServiceError';

const getAccessToken = async (username: string) => {

    return handleServiceError(async () => {
    
        const options = {
            url: `http://vault-connector:3000/access/${username}/true`,
            method: 'GET'
        };
    
        const { data } = await axios(options);
    
        return data.token;
    
    })

}

export default getAccessToken;