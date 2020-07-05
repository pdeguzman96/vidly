const errDebugger = require('debug')('app:err');

// Easy Async Error handling
require('express-async-errors');

// Handling uncaught exceptions and rejections (only happens outside of express)
process.on('uncaughtException', ex => {
    errDebugger('Uncaught Exception');
    errDebugger(ex);
    process.exit(1);
});
process.on('uncaughtRejection', ex => { throw ex });

