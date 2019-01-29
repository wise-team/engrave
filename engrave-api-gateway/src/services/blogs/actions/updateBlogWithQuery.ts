import { BlogsModel } from "../../../models/BlogsModel";

async function updateBlogWithQuery(id: any, query: any) {
    return await BlogsModel.update({_id: id}, {
        $set: query
    });
}

export default updateBlogWithQuery;