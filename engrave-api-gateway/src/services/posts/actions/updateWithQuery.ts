import { Drafts } from "../../../submodules/engrave-shared/models/Drafts";

async function updateWithQuery(id: any, query: any) {
    return await Drafts.update({_id: id}, {
        $set: query
    });
}

export default updateWithQuery;