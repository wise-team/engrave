import { ifArticleExist, deleteArticle, isUserRegistered } from "../../redis/redis";
import { IUpdate } from "../blockchain";

export default async (tx: any): Promise<IUpdate> => {
    try {

        for(const operation of tx.operations) {

            const type = operation[0];
            
            switch(type) {
                case 'vote': 
                    const { author, permlink } = operation[1];
                    
                    if(await ifArticleExist(author, permlink)) {
                        return {author: author, permlink: permlink};
                    }
                break;

                case 'comment': {
                    
                    const { parent_author, author, permlink, body} = operation[1];

                    const usernames = getMentions(body);

                    const mentions = uniq(usernames);
                    
                    if(mentions) {
                        for(const mention of mentions) {
                            if(await isUserRegistered(mention.replace('@', ''))) {
                                console.log("Mention:", mention);
                            }
                        }
                    }
                    
                    if( parent_author != author && await isUserRegistered(parent_author)) {
                        console.log("Notify new comment: ", parent_author, author, permlink);
                    }

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

                case 'transfer': {

                    const { from, to, amount } = operation[1];
                    
                    if(await isUserRegistered(to)) {
                        console.log("Notify new transfer: ", from, to, amount);
                    }
                }
                break;

                case 'custom_json': {
                   
                    const { id, json } = operation[1];
                    
                    if(id == 'follow') {
                        
                        const op = JSON.parse(json);

                        if(op[0] == 'follow') {

                            const {follower, following, what} = op[1];

                            if(await isUserRegistered(following)) {
                                if( what.length > 0) {
                                    console.log("Started following you: ", follower, following);
                                } else {
                                    console.log("Stopped following you: ", follower, following);
                                }
                            }
                        }

                        else if (op[0] == 'reblog') {

                        }
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

const getMentions = (body: string) => {
    return body.match(/@[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*(?:\.[a-z](-[a-z0-9](-[a-z0-9])*)?(-[a-z0-9]|[a-z0-9])*)*/g);
}

let uniq = (a: string[]) => [...new Set(a)];