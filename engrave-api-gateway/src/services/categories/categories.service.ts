import createCategoryWithQuery from './actions/createCategoryWithQuery';
import getCategoriesByBlogId from './actions/getCategoriesByBlogId';
import getCategoriesByQuery from './actions/getCategoriesByQuery';
import removeWithQuery from './actions/removeWithQuery';
import updateWithQuery from './actions/updateWithQuery';

const categoriesService = {
    createCategoryWithQuery,
    getCategoriesByBlogId,
    getCategoriesByQuery,
    removeWithQuery,
    updateWithQuery
}

export default categoriesService;