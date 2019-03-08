import { Categories } from "../../../submodules/engrave-shared/models/Categories";
import { ICategory } from "../../../submodules/engrave-shared/interfaces/ICategory";

async function createCategoryWithQuery(query: any): Promise<ICategory> {
    return await Categories.create(query);
}

export default createCategoryWithQuery;