import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";
import categoriesService from "../../categories/categories.service";

async function getMultipleWithQuery(query: any) {
    let blogs = await Blogs.find(query);

    for (let blog of blogs) {
        blog.categories = await categoriesService.getCategoriesByBlogId(blog._id);
    }

    return blogs
}

export default getMultipleWithQuery;