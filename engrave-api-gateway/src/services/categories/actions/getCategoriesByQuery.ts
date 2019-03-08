import { Categories } from "../../../submodules/engrave-shared/models/Categories";
import { ICategory } from "../../../submodules/engrave-shared/interfaces/ICategory";

async function getCategoriesByQuery(query: any): Promise<ICategory[]> {
    return await Categories.find(query);
}

export default getCategoriesByQuery;