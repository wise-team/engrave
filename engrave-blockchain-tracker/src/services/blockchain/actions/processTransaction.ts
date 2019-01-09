import { ifArticleExist } from "../../redis/redis";
import { IUpdate } from "../blockchain";


export default async (tx: any): Promise<IUpdate> => {
    try {
        const operation = tx.operations[0][0];

        switch(operation) {
            case 'vote': {
                const { author, permlink } = tx.operations[0][1];
        
                if(await ifArticleExist(author, permlink)) {
                    console.log('Engrave article:', author, permlink);
                    return {author: author, permlink: permlink};
                }
            }

            break;

            case 'comment': {
                const { author, permlink } = tx.operations[0][1];
        
                if(await ifArticleExist(author, permlink)) {
                    console.log('Engrave article:', author, permlink);
                    return {author: author, permlink: permlink};
                }
            }

            break;

            default:
            break;

        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}