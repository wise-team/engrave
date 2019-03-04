import axios from 'axios';
import { handleServiceError } from '../../../submodules/engrave-shared/hof/handleServiceError';

const storeAccessToken = async (username: string, token: string) => {

    return handleServiceError(async () => {
    
        const options = {
            url: "http://vault-connector:3000/access/" + username,
            method: 'POST',
            data: {
                token: token
            }
        };
 
        return await axios(options);
    
    })

}

export default storeAccessToken;