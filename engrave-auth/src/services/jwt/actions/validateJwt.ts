const jwt = require('jsonwebtoken');

const secrets = require('@cloudreach/docker-secrets');

export default (token: string) => {
    return jwt.verify(token, secrets.JWT_SECRET);
}