const jwt = require('jsonwebtoken');

export default (token: string) => {
    return jwt.verify(token, 'secret');
}