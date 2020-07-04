const errDebugger = require('debug')('app:err');

/**
 * Middleware meant to be used after request/reponse handling if it fails.
 */
module.exports = function (err, req, res, next) {
    errDebugger(err);
    res.status(500).send('Something failed.')
};