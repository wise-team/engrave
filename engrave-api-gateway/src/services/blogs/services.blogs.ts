import getBlogByQuery from "./actions/getBlogByQuery";
import createBlogWithQuery from './actions/createBlogWithQuery';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import getLatestBlogsByCategory from './actions/getLatestBlogsByCategory';
import removeBlogWithId from './actions/removeBlogWithId';
import updateBlogWithQuery from './actions/updateBlogWithQuery';
import validateBlogOwnership from './actions/validateBlogOwnership';
import getBlogsByDomain from './actions/getBlogsByDomain';


const blogsService = {
    createBlogWithQuery,
    getBlogByQuery,
    getMultipleWithQuery,
    getLatestBlogsByCategory,
    removeBlogWithId,
    updateBlogWithQuery,
    getBlogsByDomain,
    validateBlogOwnership
}

export default blogsService;