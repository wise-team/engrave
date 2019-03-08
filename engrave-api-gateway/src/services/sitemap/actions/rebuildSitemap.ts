import { IBlog } from "../../../submodules/engrave-shared/interfaces/IBlog";
import askToRebuildSitemap from './askToRebuildSitemap';

export default async (blog: IBlog) => {

    await askToRebuildSitemap(blog.domain);
    
    if(blog.custom_domain) {
        await askToRebuildSitemap(blog.custom_domain);
    }
   

}