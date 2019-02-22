import { Posts } from "../../../models/PostsModel";

async function getWithQuery(query: any) {
    return await Posts.findOne(query);
}

export default getWithQuery;