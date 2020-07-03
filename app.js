const express = require('express');
const infoDebugger = require('debug')('app:info');
const genre = require('./routes/genre');
const customer = require('./routes/customer');
const movie = require('./routes/movie');
const rental = require('./routes/rental')
const user = require('./routes/user');
const auth = require('./routes/auth');
const app = express();

app.use(express.json()); // Allowing use of json in request. sets req.body as json
app.use('/genres', genre);
app.use('/customers', customer);
app.use('/movies', movie);
app.use('/rentals', rental);
app.use('/users', user);
app.use('/auth', auth);

// Listen on a port
// Env var: PORT
infoDebugger(`APP ENV: ${app.get('env')}`);

const port = process.env.PORT || 3500
app.listen(port, () => infoDebugger(`Listening on port ${port}`))

