import engine from "../../store/engine";

async function getLastProcessedBlock(): Promise<number> {
    return parseInt(await engine.get('tracker:last_processed_block'));
}

export default getLastProcessedBlock;