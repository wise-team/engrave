import { Drafts } from "../../../submodules/engrave-shared/models/Drafts";

async function getMultipleWithQuery(query: any) {
    return await Drafts.find(query);
}

export default getMultipleWithQuery;