import axios from 'axios';
import { handleServiceError } from '../../../submodules/engrave-shared/hof/handleServiceError';

const storeRefreshToken = async (username: string, token: string) => {

    return handleServiceError(async () => {
    
        const options = {
            url: `http://vault-connector:3000/refresh/${username}`,
            method: 'POST',
            data: {
                token: token
            }
        };
 
        return await axios(options);
    
    })

}

export default storeRefreshToken;