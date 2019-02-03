const Redis = require('ioredis');

const engine = new Redis({
    host: "redis"
});

export default engine;