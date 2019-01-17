import { BlogsModel } from "../../../models/BlogsModel";

async function getMultipleWithQuery(query: any) {
    return await BlogsModel.find(query);
}

export default getMultipleWithQuery;