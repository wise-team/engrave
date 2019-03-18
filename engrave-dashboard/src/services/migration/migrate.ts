import { Blogs } from "../../submodules/engrave-shared/models/Blogs";

import { setUserRegistered } from "../../submodules/engrave-shared/services/cache/cache";

const Redis = require('ioredis');
const redis = new Redis({ host: "redis" });

export default async () => {

    if( ! await redis.get('migration:migrated')) {
        
        console.log('Migration started');

        const blogs = await Blogs.find({configured: true});
        
        for(const blog of blogs) {
 
            await setUserRegistered(blog.steem_username);
            
        }
    
        await redis.set('migration:migrated', "true");
        console.log('Migration finished');

    }


}