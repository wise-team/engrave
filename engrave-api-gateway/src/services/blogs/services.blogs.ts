import getBlogByQuery from "./actions/getBlogByQuery";
import createBlogWithQuery from './actions/createBlogWithQuery';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import removeBlogWithId from './actions/removeBlogWithId';
import updateBlogWithQuery from './actions/updateBlogWithQuery';
import validateBlogOwnership from './actions/validateBlogOwnership';
import isUrlFree from './actions/isUrlFree';


const blogsService = {
    createBlogWithQuery,
    getBlogByQuery,
    getMultipleWithQuery,
    removeBlogWithId,
    updateBlogWithQuery,
    isUrlFree,
    validateBlogOwnership
}

export default blogsService;