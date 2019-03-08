import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function isUrlFree(url: any) {
    return await Blogs.find({$or: [
        {url: url},
        {domain: url}
    ]});
}

export default isUrlFree;