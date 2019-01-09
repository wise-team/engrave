import { setLastProcessedBlock } from '../../redis/redis';
import { processBlock } from '../blockchain';

async function processBlockLoop (blockNumber: number): Promise<any> {
    try {

        const lastProcessedBlock = await processBlock(blockNumber);

        await setLastProcessedBlock(blockNumber);

        if(((new Date().getTime()) - lastProcessedBlock.timestamp) > (60 * 1000)) {
            for(let i = 0; i < 3; i++) {
                processBlock(++blockNumber); // load three blocks concurently if there is a significant delay
            }
        }

        setTimeout( ()=> processBlockLoop(blockNumber + 1), 2000)

    } catch (error) {
        setTimeout( ()=> processBlockLoop(blockNumber), 2000) // retry
    }     
}


export default processBlockLoop;