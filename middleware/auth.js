const jwt = require('jsonwebtoken');
const config = require('config');
const errDebugger = require('debug')('app:err');

/**
 * Middleware for validating JWTs
 */
function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied. No JWT provided.');

    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedPayload;
        // Passing control to the next middleware function
        next();
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(400).send('Invalid token.');
    }

}

module.exports = auth