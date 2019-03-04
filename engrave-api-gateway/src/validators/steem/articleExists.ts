import { getSteemArticle } from "../../submodules/engrave-shared/services/steem/steem";

export async function articleExists(username: string, permlink: string) {
   
    try {
        return await getSteemArticle(username, permlink);
    } catch (error) {
        return false;
    }
   
    
}