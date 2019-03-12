import { Categories } from "../../../submodules/engrave-shared/models/Categories";
import { ICategory } from "../../../submodules/engrave-shared/interfaces/ICategory";

async function updateWithQuery(id: any, query: ICategory) {
    await Categories.updateOne({_id: id}, {
        $set: query
    });

    return await Categories.findById(id);
}

export default updateWithQuery;