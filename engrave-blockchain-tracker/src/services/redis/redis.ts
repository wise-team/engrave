import getLastProcessedBlock from './actions/common/getLastProcessedBlock';
import setLastProcessedBlock from './actions/common/setLastProcessedBlock';
import ifArticleExist from './actions/articles/ifArticleExists';
import pushUpdatesToQueue from './actions/common/pushUpdatesToQueue';
import deleteArticle from './actions/articles/deleteArticle';
import isUserRegistered from './actions/users/isUserRegistered';

export {
    getLastProcessedBlock,
    setLastProcessedBlock,
    ifArticleExist,
    pushUpdatesToQueue,
    deleteArticle,
    isUserRegistered
}