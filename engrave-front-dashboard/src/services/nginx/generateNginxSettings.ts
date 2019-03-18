
import axios from 'axios';
import { handleServiceError } from '../../submodules/engrave-shared';
import { IBlog } from '../../submodules/engrave-shared/interfaces/IBlog';

export default async (blog: IBlog) => {

    return handleServiceError(async () => {

       const options = {
            method: 'POST',
            data: {
                domain: blog.domain,
                port: 80,
                is_domain_custom: false
            },
            url: "http://nginx-configurator:3000/configuration/generate"
        };
        
        return await axios(options);

    })
    
} 