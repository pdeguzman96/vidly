const errDebugger = require('debug')('app:err');
// Configurations
const config = require('config');
// Easy Async Error handling
require('express-async-errors');

// Handling uncaught exceptions and rejections (only happens outside of express)
process.on('uncaughtException', ex => {
    errDebugger('Uncaught Exception');
    errDebugger(ex);
    process.exit(1);
});
process.on('uncaughtRejection', ex => { throw ex });


// Ensure JWT env var is set
if (!config.get('jwtPrivateKey')) {
    errDebugger('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}