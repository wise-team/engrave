import { Scope } from "../helpers/jwtScope";

const secrets = require('@cloudreach/docker-secrets');
var jwt = require('jsonwebtoken');

export default (username: string, scope: Scope, adopter: boolean, ) => {
    return jwt.sign({
        data: {
            username: username,
            adopter: adopter,
            platform: 'engrave.website',
            scope: scope
        }
      }, secrets.JWT_SECRET, { expiresIn: '7d' });
}