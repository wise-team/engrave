import categoriesService from "../../services/categories/categories.service";

export async function categoryExist(id: string) {
    const [category ] = await categoriesService.getCategoriesByQuery({_id: id});
    return category != null;
}