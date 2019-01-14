import { processBlockLoop } from '../services/blockchain/blockchain';
import { getLastProcessedBlock } from '../services/redis/redis';

const steem = require('steem');

export default async () => {
    
    steem.api.setOptions({ url: 'https://anyx.io' });
    
    let startingBlock = parseInt(process.env.STARTING_BLOCK);
    const lastProcessedBlock = await getLastProcessedBlock();
    
    if(lastProcessedBlock) {
        console.log("Found last processed block number in redis: ", lastProcessedBlock);
        startingBlock = lastProcessedBlock;
    }

    await processBlockLoop(startingBlock);
    
}