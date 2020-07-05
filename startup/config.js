// Configurations
const config = require('config');

// Ensure JWT env var is set
if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
}