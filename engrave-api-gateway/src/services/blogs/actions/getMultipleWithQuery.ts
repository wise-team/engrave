import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function getMultipleWithQuery(query: any) {
    return await Blogs.find(query);
}

export default getMultipleWithQuery;