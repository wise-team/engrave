import { Posts } from "../../../models/PostsModel";
import { PostStatus } from "../../../models/EPostStatus";

async function createPostWithQuery(query: any) {
    
    query.status = PostStatus.DRAFT;
    
    return await Posts.create(query);
}

export default createPostWithQuery;