import axios from 'axios';
import { handleServiceError } from '../../../submodules/engrave-shared/hof/handleServiceError';

const storeAccessToken = async (username: string, token: string, elevated: boolean) => {

    return handleServiceError(async () => {

        console.log(username, elevated);
    
        const options = {
            url: `http://vault-connector:3000/access/${username}/${elevated}`,
            method: 'POST',
            data: {
                token: token
            }
        };
 
        return await axios(options);
    
    })

}

export default storeAccessToken;