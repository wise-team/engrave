import { Scope } from "../helpers/jwtScope";

const secrets = require('@cloudreach/docker-secrets');
var jwt = require('jsonwebtoken');

export default (username: string, scope: Scope) => {
    return jwt.sign({
        data: {
            username: username,
            platform: 'engrave.website',
            scope: scope
        }
      }, secrets.JWT_SECRET, { expiresIn: '1h' });
}