import { Drafts } from "../../../submodules/engrave-shared/models/Drafts";
import { PostStatus } from "../../../submodules/engrave-shared/enums/PostStatus";

async function createPostWithQuery(query: any) {
    
    query.status = PostStatus.DRAFT;
    
    return await Drafts.create(query);
}

export default createPostWithQuery;