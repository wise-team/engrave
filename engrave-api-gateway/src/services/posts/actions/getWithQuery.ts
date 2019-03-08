import { Posts } from "../../../submodules/engrave-shared/models/Posts";

async function getWithQuery(query: any) {
    return await Posts.findOne(query);
}

export default getWithQuery;