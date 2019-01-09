import { getDataFromUpdateString } from "../queue";

const Redis = require('ioredis');
const redis = new Redis({ host: "redis" });
const steem = require('steem');


export default async () => {
    try {

        const update = await redis.rpop('updates');

        if(update) {
            const {author, permlink} = getDataFromUpdateString(update);
            const article = await steem.api.getContentAsync(author, permlink);
            console.log(article);
        }
        
    } catch (error) {
        console.log(error);
    }
}