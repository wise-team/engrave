import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function getBlogByQuery(query: any) {
    return await Blogs.findOne(query);
}

export default getBlogByQuery;