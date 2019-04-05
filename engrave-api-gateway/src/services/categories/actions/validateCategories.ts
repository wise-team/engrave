import categoriesService from '../categories.service';

async function validateCategories(ids: string[], blogId: string) {
    
    if(!ids) return;

    for(let id of ids) {
        const category = await categoriesService.getCategoryById(id);
        if(!category) throw new Error("Category not exists");
        if(category.blogId != blogId) throw new Error("Category not exists in this blog");
    }
}

export default validateCategories;