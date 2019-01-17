import getBlogByQuery from "./actions/getBlogByQuery";
import createBlogWithQuery from './actions/createBlogWithQuery';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import removeBlogWithQuery from './actions/removeBlogWithQuery';


const blogsService = {
    createBlogWithQuery,
    getBlogByQuery,
    getMultipleWithQuery,
    removeBlogWithQuery
}

export default blogsService;