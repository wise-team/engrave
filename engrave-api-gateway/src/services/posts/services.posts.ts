import createPostWithQuery from './actions/createPostWithQuery';
import createDraft from './actions/createDraft';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import getWithQuery from './actions/getWithQuery';
import removeWithQuery from './actions/removeWithQuery';
import updateWithQuery from './actions/updateWithQuery';

const postsService = {
    createDraft,
    createPostWithQuery,
    getMultipleWithQuery,
    getWithQuery,
    removeWithQuery,
    updateWithQuery
}

export default postsService;