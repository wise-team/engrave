import { Posts } from "../../../models/PostsModel";

async function updateWithQuery(id: any, query: any) {
    return await Posts.update({_id: id}, {
        $set: query
    });
}

export default updateWithQuery;