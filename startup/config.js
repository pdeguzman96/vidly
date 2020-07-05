// Configurations
const config = require('config');
const errDebugger = require('debug')('app:err')

// Ensure JWT env var is set
if (!config.get('jwtPrivateKey')) {
    errDebugger('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}