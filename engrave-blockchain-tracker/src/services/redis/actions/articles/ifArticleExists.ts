import engine from "../../store/engine";

async function ifArticleExists(username: string, permlink: string) {
    return (await engine.get(`engrave:${username}:${permlink}`) != null);
}

export default ifArticleExists;