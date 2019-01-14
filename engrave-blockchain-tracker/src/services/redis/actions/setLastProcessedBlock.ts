const Redis = require('ioredis');

const redis = new Redis({
    host: "redis"
});

async function setLastProcessedBlock(blockNumber: number) {
    return await redis.set('tracker:last_processed_block', blockNumber);
}

export default setLastProcessedBlock;