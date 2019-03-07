import { getDataFromUpdateString } from "../queue";
import { setArticle, removeArticle } from '../../../submodules/engrave-shared/services/cache/cache';

const Redis = require('ioredis');
const redis = new Redis({ host: "redis" });
const steem = require('steem');

export default async () => {
    try {

        const update = await redis.rpop('updates');

        if(update) {
            const {author, permlink} = getDataFromUpdateString(update);

            console.log(" * Consumed article:", author, permlink);

            const article = await steem.api.getContentAsync(author, permlink);
            
            const { domain } = JSON.parse(article.json_metadata);

            if(domain && article) {
                return await setArticle(domain, author, permlink, article);
            } else {
                console.log(" > Domain or article not found");
                return null;
            }
        }
        
    } catch (error) {
        console.log(error);
    }
}