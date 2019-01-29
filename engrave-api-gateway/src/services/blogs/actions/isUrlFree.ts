import { BlogsModel } from "../../../models/BlogsModel";

async function isUrlFree(url: any) {
    return await BlogsModel.find({$or: [
        {url: url},
        {domain: url}
    ]});
}

export default isUrlFree;