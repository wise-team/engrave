import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";
import categoriesService from "../../categories/categories.service";

async function getBlogByQuery(query: any) {
    let blog = await Blogs.findOne(query).populate('categories');
    blog.categories = await categoriesService.getCategoriesByBlogId(blog._id);
    return blog 
}

export default getBlogByQuery;