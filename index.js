// API
const express = require('express');
// Logging
const infoDebugger = require('debug')('app:info');


// Initializing app
const app = express();
// Log app environment (development, stage, or production)
infoDebugger(`APP ENV: ${app.get('env')}`);

// Startup functionality for logging, configs, db connection, and routes
require('./startup/log');
require('./startup/config');
require('./startup/db');
require('./startup/routes')(app);


// Listen on a port
const port = process.env.PORT || 5123
app.listen(port, () => infoDebugger(`Listening on port ${port}`))
