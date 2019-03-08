import { Posts } from "../../../submodules/engrave-shared/models/Posts";

async function createPostWithQuery(query: any) {
    return await Posts.create(query);
}

export default createPostWithQuery;