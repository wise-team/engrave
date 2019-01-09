import app from './app/app';
import { listenOnPort } from './submodules/engrave-shared/utils/listenOnPort';
import waitForMicroservice from './submodules/engrave-shared/utils/waitForMicroservice';
import config from './submodules/engrave-shared/config/config';
import { Blogs } from './submodules/engrave-shared/models/BlogsModel';
import generateNginxSettings from './services/nginx/generateSettings';

( async() => {
    
    await waitForMicroservice(config.services.ssl);
    
    try {
        const blogs = await Blogs.find({configured: true, is_domain_custom: true});
        
        for(const blog of blogs) {
            await generateNginxSettings(blog.domain, blog.port, blog.is_domain_custom);
        }
        
    } catch (error) {
        console.log(error);
    }

    listenOnPort(app, 3000);

} )();

