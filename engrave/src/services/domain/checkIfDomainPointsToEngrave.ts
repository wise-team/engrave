
import axios from 'axios';
import { handleServiceError } from '../../submodules/engrave-shared';

export default async (domain: string) => {

    return handleServiceError(async () => {

       const options = {
            method: 'POST',
            data: {
                domain: domain,
            },
            url: "http://ssl:3000/domain/validate"
        };
        
        const { data: { is_pointing } } = await axios(options);

        return is_pointing;

    })
    
} 