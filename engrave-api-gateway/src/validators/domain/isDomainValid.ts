import axios from 'axios';
import { handleServiceError } from '../../submodules/engrave-shared';

export default async (domain: string) => {

    return handleServiceError( async () => {
        const options = {
            method: 'POST',
            data: {
                domain: domain
            },
            url: "http://ssl:3000/domain/validate"
        };
    
        const response = await axios(options);

        const { is_pointing } = response.data;
    
        return is_pointing;
    }) 

}