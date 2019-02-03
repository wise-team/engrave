import blogsService from "../../services/blogs/services.blogs";

export async function blogExists(id: any) {
    return await blogsService.getBlogByQuery({_id: id});
}