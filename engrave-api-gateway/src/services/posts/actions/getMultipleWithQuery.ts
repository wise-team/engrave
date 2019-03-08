import { Posts } from "../../../submodules/engrave-shared/models/Posts";

async function getMultipleWithQuery(query: any) {
    return await Posts.find(query);
}

export default getMultipleWithQuery;