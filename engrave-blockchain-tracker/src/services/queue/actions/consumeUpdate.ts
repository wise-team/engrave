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
            const article = await steem.api.getContentAsync(author, permlink);
            const {domain} = JSON.parse(article.json_metadata);

            await removeArticle(author, permlink);
            
            return await setArticle(domain, author, permlink, article);
        }
        
    } catch (error) {
        console.log(error);
    }
}