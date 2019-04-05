import { Categories } from "../../../submodules/engrave-shared/models/Categories";
import { ICategory } from "../../../submodules/engrave-shared/interfaces/ICategory";

async function getCategoryById(id: string): Promise<ICategory> {
    return await Categories.findById(id);
}

export default getCategoryById;