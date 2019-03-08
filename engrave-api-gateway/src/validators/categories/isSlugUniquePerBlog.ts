import categoriesService from "../../services/categories/categories.service";

export async function isSlugUniquePerBlog(blogId: string, slug: string) {

    const categories = await categoriesService.getCategoriesByQuery({blogId: blogId, slug: slug});

    if (categories.length) return false;

    return true;
}