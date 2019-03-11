import { Drafts } from "../../../submodules/engrave-shared/models/Drafts";

async function removeWithQuery(query: any) {
    return await Drafts.remove(query);
}

export default removeWithQuery;