import { getDataFromUpdateString } from "../queue";
import parseSteemArticle from "../../../submodules/engrave-shared/services/article/parseSteemArticle";
import {getBlog} from '../../../submodules/engrave-shared/services/cache/cache';

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
            const blog = await getBlog(domain);

            const parsedArticle = parseSteemArticle(article, blog);
            
            await redis.set(`article:${author}:${permlink}`, JSON.stringify(parsedArticle));
            
            return parsedArticle
        }
        
    } catch (error) {
        console.log(error);
    }
}