import getAccessToken from './actions/getAccessToken';
import getRefreshToken from './actions/getRefreshToken';
import storeAccessToken from './actions/storeAccessToken';
import storeRefreshToken from './actions/storeRefreshToken';

const vault = {
    getAccessToken,
    getRefreshToken,
    storeAccessToken,
    storeRefreshToken
}

export default vault;