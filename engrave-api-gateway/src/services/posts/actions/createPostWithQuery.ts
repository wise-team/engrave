import { Drafts } from "../../../submodules/engrave-shared/models/Drafts";

async function createPostWithQuery(query: any) {
    return await Drafts.create(query);
}

export default createPostWithQuery;