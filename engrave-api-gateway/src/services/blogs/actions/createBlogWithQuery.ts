import { BlogsModel } from "../../../models/BlogsModel";

async function createBlogWithQuery(query: any) {
    return await BlogsModel.create(query);
}

export default createBlogWithQuery;