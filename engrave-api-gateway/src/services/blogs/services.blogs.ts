import getBlogByQuery from "./actions/getBlogByQuery";
import createBlogWithQuery from './actions/createBlogWithQuery';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import removeBlogWithId from './actions/removeBlogWithId';
import updateBlogWithQuery from './actions/updateBlogWithQuery';
import validateBlogOwnership from './actions/validateBlogOwnership';
import getBlogsByDomain from './actions/getBlogsByDomain';


const blogsService = {
    createBlogWithQuery,
    getBlogByQuery,
    getMultipleWithQuery,
    removeBlogWithId,
    updateBlogWithQuery,
    getBlogsByDomain,
    validateBlogOwnership
}

export default blogsService;