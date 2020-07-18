// API
const express = require('express');
// Logging
const infoDebugger = require('debug')('app:info');

// Initializing app
const app = express();
// Log app environment (development, stage, or production)
infoDebugger(`APP ENV: ${app.get('env')}`);

// Startup functionality for logging, configs, db connection, and routes
require('./startup/log'); // For handling unhandled exceptions and rejections
require('./startup/config'); // For ensuring proper config is set in environment
require('./startup/db'); // For establishing conn to DB
require('./startup/routes')(app); // For creating routes for the APIs

// Listen on a port
const port = process.env.PORT || 5123
const server = app.listen(port, () => infoDebugger(`Listening on port ${port}`))

module.exports = server;