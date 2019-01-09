const Redis = require('ioredis');

const redis = new Redis({
    host: "redis"
});

async function getLastProcessedBlock(): Promise<number> {
    return parseInt(await redis.get('tracker:last_processed_block'));
}

export default getLastProcessedBlock;