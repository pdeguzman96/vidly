// APIs
const express = require('express');
const router = express.Router();
// DB Model
const { User } = require('../models/users');
const db = require('../db/db');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Input Validation
const joi = require('../joi_schemas');
// Lodash - utility
const _ = require('lodash');
// For salt hashing passwords;
const bcrypt = require('bcrypt');
// Middleware for validating JWT
const auth = require('../middleware/auth');

/**
 * Get users using JWT
 * @return { Object } User object requested
 */
router.get('/me', auth, async (req, res) =>{
    infoDebugger('Getting single user');

    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).send(`user with ID ${req.user._id} not found.`);
        res.send(user);
    }

    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex);
    }
})

/**
 * Create a new user
 * @param { String } req.body.name Name of the user
 * @param { String } req.body.email User's email
 * @param { String } req.body.password The user's password
 * @return { Object } User object created
 */
router.post('/', async(req, res) => {
    infoDebugger('Creating new user');
    const { error, value } = joi.userCreateSchema.validate(req.body);
    infoDebugger(value);
    if (error) return res.status(400).send(error);

    const user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('Email already registered.');

    try {
        const newUser = User(_.pick(req.body, ['name', 'email', 'password']));
        // Generating salt and created a hashed password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        // Generating JWT for the newly registered user
        const token = newUser.generateAuthToken();
        
        await newUser.save();
        res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'name', 'email']));
    }

    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex);
    }
});

module.exports = router;