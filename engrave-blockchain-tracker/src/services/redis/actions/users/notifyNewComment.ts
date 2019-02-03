import engine from "../../store/engine";

async function notifyNewComment(username: string, timestamp: number, author: string, permlink: string) {

    return await engine.zadd(`notifications:${username}`, timestamp, `@${author} replied at ${permlink}`);

}

export default notifyNewComment;