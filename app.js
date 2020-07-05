// API
const express = require('express');
// Easy Async Error handling
require('express-async-errors');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Configurations
const config = require('config');
// Handling uncaught exceptions and rejections (only happens outside of express)
process.on('uncaughtException', ex => {
    errDebugger('Uncaught Exception');
    errDebugger(ex);
    process.exit(1);
});

process.on('uncaughtRejection', ex => { throw ex });

// Initializing app
const app = express();

// Connect to DB
require('./db/db');

// Ensure JWT env var is set
if (!config.get('jwtPrivateKey')) {
    errDebugger('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

// Loading routes
require('./startup/routes')(app);

// Listen on a port
// Env var: PORT
infoDebugger(`APP ENV: ${app.get('env')}`);

const port = process.env.PORT || 5123
app.listen(port, () => infoDebugger(`Listening on port ${port}`))

