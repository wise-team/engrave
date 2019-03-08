import { getLatestFromCategory } from "../../submodules/engrave-shared/services/cache/cache";
import { ICategory } from "../../submodules/engrave-shared/interfaces/ICategory";

export async function validateCategoryIsEmpty(category: ICategory) {

    const posts = await getLatestFromCategory(category._id, category.blogId, 0, 1);

    return (posts.length == 0);

}