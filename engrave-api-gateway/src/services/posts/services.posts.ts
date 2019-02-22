import createPostWithQuery from './actions/createPostWithQuery';
import createDraft from './actions/createDraft';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import getWithQuery from './actions/getWithQuery';

const postsService = {
    createDraft,
    createPostWithQuery,
    getMultipleWithQuery,
    getWithQuery
}

export default postsService;