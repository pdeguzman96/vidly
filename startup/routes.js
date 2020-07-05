const express = require('express');
// API Routes
const genre = require('../routes/genre');
const customer = require('../routes/customer');
const movie = require('../routes/movie');
const rental = require('../routes/rental')
const user = require('../routes/user');
const auth = require('../routes/auth');
const error = require('../middleware/error');

/**
 * Startup function for loading routes.
 */
module.exports = function (app) {
    app.use(express.json()); // Allowing use of json in request. sets req.body as json
    app.use('/genres', genre);
    app.use('/customers', customer);
    app.use('/movies', movie);
    app.use('/rentals', rental);
    app.use('/users', user);
    app.use('/auth', auth);
    // Error middleware for handling errors after request/response failure
    app.use(error);
}