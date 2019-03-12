import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function updateBlogWithQuery(id: any, query: any) {
    await Blogs.updateOne({_id: id}, {
        $set: query
    });

    return await Blogs.findById(id);
}

export default updateBlogWithQuery;