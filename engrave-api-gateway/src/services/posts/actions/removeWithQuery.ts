import { Posts } from "../../../submodules/engrave-shared/models/Posts";

async function removeWithQuery(query: any) {
    return await Posts.remove(query);
}

export default removeWithQuery;