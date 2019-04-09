import { Categories } from "../../../submodules/engrave-shared/models/Categories";

async function removeWithQuery(query: any) {
    return await Categories.deleteOne(query);
}

export default removeWithQuery;