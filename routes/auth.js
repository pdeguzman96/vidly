// APIs
const express = require('express');
const router = express.Router();
// DB Model
const { User } = require('../models/users');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Input Validation
const joi = require('../validations/joi_schemas');
// Lodash
const _ = require('lodash');
// For salt hashing passwords;
const bcrypt = require('bcrypt');

/**
 * Authenticate a user via password
 * @param { String } req.body.email User's email
 * @param { String } req.body.password The user's password
 * @return { String } JWT for the authenticated user
 */
router.post('/', async(req, res) => {
    infoDebugger('Validating user');
    const { error } = joi.validateUser(req.body);
    if (error) return res.status(400).send(error);
    
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.');
    
    // bcrypt compares the given password to the salted password. If the given password, resalted and hashed is equal, return true
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');
    
    infoDebugger('Authenticated.');
    const token = user.generateAuthToken();
    res.send(token);
});

module.exports = router;