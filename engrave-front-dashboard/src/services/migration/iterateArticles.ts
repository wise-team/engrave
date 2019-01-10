import { setArticle } from "../../submodules/engrave-shared/services/cache/cache";
import { IBlog } from "../../submodules/engrave-shared/interfaces/IBlog";
import validateSteemArticle from "../../submodules/engrave-shared/services/article/validateSteemArticle";

const steem = require('steem');

export default async (blog: IBlog) => {

    try {
        const limit = 10;
        let counter = limit;
        let query: any = {
            tag: blog.steem_username,
            limit: limit
        }

        do {
            const posts = await steem.api.getDiscussionsByBlogAsync(query);
            counter = posts.length;

            for(const post of posts) {

                query.start_author = post.author;
                query.start_permlink = post.permlink;
                
                if(post.author == blog.steem_username) { // ignore resteems
                    
                    if(validateSteemArticle(post)) {
                        console.log(" * Engrave article migrated:", blog.steem_username, post.permlink);
                        await setArticle(blog.domain, blog.steem_username, post.permlink, post);
                    }

                }
                
            }

        } while(counter == limit)

    } catch (error) {
        console.log(error);   
    }

}