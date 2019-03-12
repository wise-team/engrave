import categoriesService from "../../services/categories/categories.service";

export async function validateIsSlugUniquePerBlog(blogId: string, slug: string, categoryId: string) {

    const categories = await categoriesService.getCategoriesByQuery({blogId: blogId, slug: slug});

    if (categories.length && categories[0]._id != categoryId) throw new Error("Category slug must be unique");

}