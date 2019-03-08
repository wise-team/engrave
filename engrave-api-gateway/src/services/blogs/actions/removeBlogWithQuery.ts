import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function removeBlogWithQuery(query: any) {
    return await Blogs.remove(query);
}

export default removeBlogWithQuery;