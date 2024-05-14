const jwt = require('jswonwebtoken');
const secret = 'rahasia';

const generateToken = (payload) => {
    return jwt.sign(payload, secret);
}
const verifyToken = (token) => {
    return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };