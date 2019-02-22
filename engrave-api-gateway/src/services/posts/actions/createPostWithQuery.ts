import { Posts } from "../../../models/PostsModel";

async function createPostWithQuery(query: any) {
    return await Posts.create(query);
}

export default createPostWithQuery;