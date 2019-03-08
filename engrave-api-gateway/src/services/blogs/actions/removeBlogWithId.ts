import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";
import categoriesService from "../../categories/categories.service";

async function removeBlogWithId(id: string) {

    await Blogs.deleteOne({_id: id});

    const categories = await categoriesService.getCategoriesByBlogId(id);

    for(let category of categories) {
        await category.remove();
    }

}

export default removeBlogWithId;