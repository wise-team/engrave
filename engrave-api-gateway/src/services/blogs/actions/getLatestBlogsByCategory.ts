import { Blogs } from "../../../submodules/engrave-shared/models/Blogs";

async function getLatestBlogsByCategory(category: string, skip: number, limit: number) {
    
    let blogs = await Blogs.find( category ? {content_category: category} : {}).skip(skip).limit(limit).select('-_id domain custom_domain domain_redirect title slogan owner content_category');

    return blogs
}

export default getLatestBlogsByCategory;