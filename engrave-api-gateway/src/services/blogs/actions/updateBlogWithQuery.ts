import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";
import categoriesService from "../../categories/categories.service";

async function updateBlogWithQuery(id: any, query: any) {
    await Blogs.updateOne({_id: id}, {
        $set: query
    });

    const blog = await Blogs.findById(id).populate('categories');
    blog.categories = await categoriesService.getCategoriesByBlogId(blog._id);

    return blog;
}

export default updateBlogWithQuery;