
import axios from 'axios';
import { handleServiceError } from '../../submodules/engrave-shared';
import { IBlog } from '../../submodules/engrave-shared/interfaces/IBlog';

export default async (blog: IBlog) => {

    return handleServiceError(async () => {

       const options = {
            method: 'POST',
            data: {
                domain: blog.domain,
                port: blog.port,
                is_domain_custom: blog.is_domain_custom,
            },
            url: "http://nginx-configurator:3000/configuration/generate"
        };
        
        return await axios(options);

    })
    
} 