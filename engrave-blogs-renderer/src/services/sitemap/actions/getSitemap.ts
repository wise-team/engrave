import { IBlog } from "../../../submodules/engrave-shared/interfaces/IBlog";
import { handleServiceError } from "../../../submodules/engrave-shared";
import axios from 'axios';

export default async (blog: IBlog) => {

    return handleServiceError(async () => {
    
        const options = {
            url: "http://sitemap-builder:3000/sitemap",
            method: 'GET',
            data: {
                domain: blog.domain,
                username: blog.owner
            }
        };
    
        const { data } = await axios(options);
    
        return data;
    
    })

}