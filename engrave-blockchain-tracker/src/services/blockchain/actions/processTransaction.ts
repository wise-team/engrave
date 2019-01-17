import { ifArticleExist, deleteArticle } from "../../redis/redis";
import { IUpdate } from "../blockchain";

export default async (tx: any): Promise<IUpdate> => {
    try {

        for(const operation of tx.operations) {

            const type = operation[0];
            
            switch(type) {
                case 'vote': 
                case 'comment': {
                    const { author, permlink } = operation[1];
                    if(await ifArticleExist(author, permlink)) {
                        return {author: author, permlink: permlink};
                    }
                }
                
                break;
                
                case 'delete_comment': {
                    const { author, permlink } = operation[1];
                    if(await ifArticleExist(author, permlink)) {
                        deleteArticle(author, permlink);
                    }
                }
    
                break;
    
                default:
                break;
            }
        }

        return null;

    } catch (error) {
        console.log(error);
        return null;
    }
}