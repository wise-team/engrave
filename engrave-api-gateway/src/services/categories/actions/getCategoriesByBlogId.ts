import { Categories } from "../../../submodules/engrave-shared/models/Categories";
import { ICategory } from "../../../submodules/engrave-shared/interfaces/ICategory";

async function getCategoriesByBlogId(blogId: string): Promise<ICategory[]> {
    return await Categories.find({blogId: blogId});
}

export default getCategoriesByBlogId;