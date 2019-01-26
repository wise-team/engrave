import createJwt from './actions/createJwt';
import validateJwt from './actions/validateJwt';
import { Scope } from './helpers/jwtScope';

const jwt = {
    createJwt,
    validateJwt,
    Scope
}

export default jwt;