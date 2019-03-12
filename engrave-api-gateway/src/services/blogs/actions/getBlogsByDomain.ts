import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function getBlogsByDomain(url: any) {
    return await Blogs.find({$or: [
        {domain: url},
        {custom_domain: url}
    ]});
}

export default getBlogsByDomain;