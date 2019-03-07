import engine from "../../store/engine";

async function pushUpdatesToQueue(updates: any[]) {
    for(let update of updates) {
        await engine.lpush('updates', `${update.author}:${update.permlink}`);
    }
}

export default pushUpdatesToQueue;