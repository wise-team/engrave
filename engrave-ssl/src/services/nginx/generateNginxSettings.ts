import { IBlog } from "../../submodules/engrave-shared/interfaces/IBlog";
import { handleServiceError } from "../../submodules/engrave-shared";
import axios from 'axios';

export default async (blog: IBlog) => {

    return handleServiceError(async () => {

       const options = {
            method: 'POST',
            data: {
                domain: blog.domain,
                port: blog.port,
                is_domain_custom: blog.is_domain_custom
            },
            url: "http://nginx-configurator:3000/configuration/generate"
        };
    
        return await axios(options);

    })
    
} 