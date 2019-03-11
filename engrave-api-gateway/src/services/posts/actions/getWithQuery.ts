import { Drafts } from "../../../submodules/engrave-shared/models/Drafts";

async function getWithQuery(query: any) {
    return await Drafts.findOne(query);
}

export default getWithQuery;