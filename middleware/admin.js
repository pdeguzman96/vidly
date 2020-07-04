/**
 * Middleware for validating admin access
 */
function admin(req, res, next) {
    // 401: Unauthorized - need to send a valid JWT
    // 403: Forbidden - if JWT is valid, but you have no acess
    if (!req.user.isAdmin) return res.status(403).send('Access Denied. You must be an admin to perform this action.');

    next();
}

module.exports = admin