import { Posts } from "../../../models/PostsModel";

async function removeWithQuery(query: any) {
    return await Posts.remove(query);
}

export default removeWithQuery;