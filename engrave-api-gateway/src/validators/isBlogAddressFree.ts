import blogsService from "../services/blogs/services.blogs";

export async function isBlogAddressFree(url: any) {
    const blogs = await blogsService.isUrlFree(url);
    return (blogs.length == 0);
}