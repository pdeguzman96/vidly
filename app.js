const express = require('express');
const genre = require('./routes/genre')
const morgan = require('morgan')
const infoDebugger = require('debug')('app:info')
// Middleware and Request Pipeline...
// Request----json()---route()---> Response
const app = express();
app.use(express.json()); // Allowing use of json in request. sets req.body as json
app.use('/genres', genre)

// Listen on a port
// Env var: PORT
infoDebugger(`APP ENV: ${app.get('env')}`);
if (app.get('env') === 'development' || app.get('env') === 'stage') {
    infoDebugger('Enabling Morgan...');
    app.use(morgan);
}
const port = process.env.PORT || 3500
app.listen(port, () => infoDebugger(`Listening on port ${port}`))