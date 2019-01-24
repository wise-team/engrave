import getBlogByQuery from "./actions/getBlogByQuery";
import createBlogWithQuery from './actions/createBlogWithQuery';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import removeBlogWithQuery from './actions/removeBlogWithQuery';
import updateBlogWithQuery from './actions/updateBlogWithQuery';
import isUrlFree from './actions/isUrlFree';


const blogsService = {
    createBlogWithQuery,
    getBlogByQuery,
    getMultipleWithQuery,
    removeBlogWithQuery,
    updateBlogWithQuery,
    isUrlFree
}

export default blogsService;