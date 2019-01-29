import { handleServiceError } from "../../../submodules/engrave-shared";
import axios from 'axios';

export default async (token: string) => {

    return handleServiceError(async () => {

       const options = {
            method: 'POST',
            data: {
                token
            },
            url: "http://auth:3000/validate"
        };

        const { data } = await axios(options);
    
        return data;

    })
    
} 