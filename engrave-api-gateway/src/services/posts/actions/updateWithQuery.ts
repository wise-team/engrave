import { Posts } from "../../../submodules/engrave-shared/models/Posts";

async function updateWithQuery(id: any, query: any) {
    return await Posts.update({_id: id}, {
        $set: query
    });
}

export default updateWithQuery;