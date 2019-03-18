import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function getMultipleWithQuery(query: any) {
    let blogs = await Blogs.find(query);

    return blogs
}

export default getMultipleWithQuery;