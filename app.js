// API
const express = require('express');
// Logging
const infoDebugger = require('debug')('app:info');

// For logging exceptions and checking the JWT
require('./startup/log');

// Initializing app
const app = express();
// Log app environment (development, stage, or production)
infoDebugger(`APP ENV: ${app.get('env')}`);

// Connect to DB
require('./db/db');

// Loading routes
require('./startup/routes')(app);

// Listen on a port
const port = process.env.PORT || 5123
app.listen(port, () => infoDebugger(`Listening on port ${port}`))
