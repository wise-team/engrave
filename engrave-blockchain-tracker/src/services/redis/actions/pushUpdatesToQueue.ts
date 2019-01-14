const Redis = require('ioredis');

const redis = new Redis({
    host: "redis"
});

async function pushUpdatesToQueue(updates: any[]) {
    updates.map((update)=> {
        redis.lpush('updates', `${update.author}:${update.permlink}`)
    })
}

export default pushUpdatesToQueue;