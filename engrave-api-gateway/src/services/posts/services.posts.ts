import createPostWithQuery from './actions/createPostWithQuery';
import createDraft from './actions/createDraft';
import getMultipleWithQuery from './actions/getMultipleWithQuery';
import getWithQuery from './actions/getWithQuery';
import removeWithQuery from './actions/removeWithQuery';
import updateWithQuery from './actions/updateWithQuery';
import validatePostOwnership from './actions/validatePostOwnership';

const postsService = {
    createDraft,
    createPostWithQuery,
    getMultipleWithQuery,
    getWithQuery,
    removeWithQuery,
    updateWithQuery,
    validatePostOwnership
}

export default postsService;