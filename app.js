// API
const express = require('express');
// Easy Async Error handling
require('express-async-errors');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// API Routes
const genre = require('./routes/genre');
const customer = require('./routes/customer');
const movie = require('./routes/movie');
const rental = require('./routes/rental')
const user = require('./routes/user');
const auth = require('./routes/auth');
// Configurations
const config = require('config');
const error = require('./middleware/error');

// Handling uncaught exceptions and rejections (only happens outside of express)
process.on('uncaughtException', ex => {
    errDebugger('Uncaught Exception');
    errDebugger(ex);
    process.exit(1);
});

process.on('uncaughtRejection', ex => { throw ex });

// Initializing app
const app = express();

if (!config.get('jwtPrivateKey')) {
    errDebugger('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

app.use(express.json()); // Allowing use of json in request. sets req.body as json
app.use('/genres', genre);
app.use('/customers', customer);
app.use('/movies', movie);
app.use('/rentals', rental);
app.use('/users', user);
app.use('/auth', auth);
// Error middleware for handling errors after request/response failure
app.use(error);

// Listen on a port
// Env var: PORT
infoDebugger(`APP ENV: ${app.get('env')}`);

const port = process.env.PORT || 5123
app.listen(port, () => infoDebugger(`Listening on port ${port}`))

