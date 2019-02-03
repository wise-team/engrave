import engine from "../../store/engine";

async function pushUpdatesToQueue(updates: any[]) {
    updates.map((update)=> {
        engine.lpush('updates', `${update.author}:${update.permlink}`)
    })
}

export default pushUpdatesToQueue;