import { BlogsModel } from "../../../models/BlogsModel";

async function removeBlogWithQuery(query: any) {
    return await BlogsModel.remove(query);
}

export default removeBlogWithQuery;