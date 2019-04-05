import createCategoryWithQuery from './actions/createCategoryWithQuery';
import getCategoriesByBlogId from './actions/getCategoriesByBlogId';
import getCategoriesByQuery from './actions/getCategoriesByQuery';
import getCategoryById from './actions/getCategoryById';
import removeWithQuery from './actions/removeWithQuery';
import updateWithQuery from './actions/updateWithQuery';
import validateCategories from './actions/validateCategories';

const categoriesService = {
    createCategoryWithQuery,
    getCategoriesByBlogId,
    getCategoriesByQuery,
    getCategoryById,
    removeWithQuery,
    updateWithQuery,
    validateCategories
}

export default categoriesService;