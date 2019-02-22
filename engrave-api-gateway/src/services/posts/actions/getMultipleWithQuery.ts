import { Posts } from "../../../models/PostsModel";

async function getMultipleWithQuery(query: any) {
    return await Posts.find(query);
}

export default getMultipleWithQuery;