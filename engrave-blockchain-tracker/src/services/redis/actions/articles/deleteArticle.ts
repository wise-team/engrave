import { removeArticle } from "../../../../submodules/engrave-shared/services/cache/cache";

async function deleteArticle(username: string, permlink: string) {

    try {      
        return await removeArticle(username, permlink);
    } catch (error) {
        console.log(error);
    }
}

export default deleteArticle;