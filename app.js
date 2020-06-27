const express = require('express');
const morgan = require('morgan')
const infoDebugger = require('debug')('app:info')
// Middleware and Request Pipeline...
// Request----json()---route()---> Response
const app = express();
const genre = require('./routes/genre')
const customer = require('./routes/customer')

app.use(express.json()); // Allowing use of json in request. sets req.body as json
app.use('/genres', genre)
app.use('/customers', customer)

// Listen on a port
// Env var: PORT
infoDebugger(`APP ENV: ${app.get('env')}`);
if (app.get('env') === 'development' || app.get('env') === 'stage') {
    infoDebugger('Enabling Morgan...');
    app.use(morgan("default"));
}
const port = process.env.PORT || 3500
app.listen(port, () => infoDebugger(`Listening on port ${port}`))

