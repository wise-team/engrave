import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function createBlogWithQuery(query: any) {
    return await Blogs.create(query);
}

export default createBlogWithQuery;