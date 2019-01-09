const Redis = require('ioredis');

const redis = new Redis({ host: "redis" });

async function deleteArticle(username: string, permlink: string) {
    await redis.del(`article:${username}:${permlink}`);
    await redis.zrem(`created:${username}`, permlink);
}

export default deleteArticle;