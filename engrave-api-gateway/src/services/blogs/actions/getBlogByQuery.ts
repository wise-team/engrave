import { BlogsModel } from "../../../models/BlogsModel";

async function getBlogByQuery(query: any) {
    return await BlogsModel.findOne(query);
}

export default getBlogByQuery;