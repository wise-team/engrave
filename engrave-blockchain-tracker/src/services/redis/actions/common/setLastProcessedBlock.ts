import engine from "../../store/engine";

async function setLastProcessedBlock(blockNumber: number) {
    return await engine.set('tracker:last_processed_block', blockNumber);
}

export default setLastProcessedBlock;