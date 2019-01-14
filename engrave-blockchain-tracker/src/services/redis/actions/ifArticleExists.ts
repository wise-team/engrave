const Redis = require('ioredis');

const redis = new Redis({
    host: "redis"
});

async function ifArticleExists(username: string, permlink: string) {
    return (await redis.get(`engrave:${username}:${permlink}`) != null);
}

export default ifArticleExists;