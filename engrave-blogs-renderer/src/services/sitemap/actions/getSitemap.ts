import { handleServiceError } from "../../../submodules/engrave-shared";
import axios from 'axios';

export default async (domain: string) => {

    return handleServiceError(async () => {
    
        const options = {
            url: "http://sitemap-builder:3000/sitemap",
            method: 'GET',
            data: {
                domain: domain
            }
        };
    
        const { data } = await axios(options);
    
        return data;
    
    })

}