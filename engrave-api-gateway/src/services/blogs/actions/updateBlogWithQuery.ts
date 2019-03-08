import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function updateBlogWithQuery(id: any, query: any) {
    return await Blogs.update({_id: id}, {
        $set: query
    });
}

export default updateBlogWithQuery;