import { Drafts } from "../../../submodules/engrave-shared/models/Posts";

async function getMultipleWithQuery(query: any) {
    return await Drafts.find(query);
}

export default getMultipleWithQuery;