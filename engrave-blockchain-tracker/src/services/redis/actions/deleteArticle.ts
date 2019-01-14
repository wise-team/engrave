import { removeArticle } from "../../../submodules/engrave-shared/services/cache/cache";

const Redis = require('ioredis');

const redis = new Redis({ host: "redis" });

async function deleteArticle(username: string, permlink: string) {

    try {      
        return await removeArticle(username, permlink);
    } catch (error) {
        console.log(error);
    }
}

export default deleteArticle;