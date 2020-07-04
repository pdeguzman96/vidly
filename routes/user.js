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
// Middleware for encapsulating try/catch route handlers
const asyncMiddleware = require('../middleware/async');

/**
 * Get users using JWT
 * @return { Object } User object requested
 */
router.get('/me', auth, asyncMiddleware(async (req, res) =>{
    infoDebugger('Getting single user');
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send(`user with ID ${req.user._id} not found.`);
    res.send(user);
    })
)

/**
 * Create a new user if user's email isn't already registered
 * @param { String } req.body.name Name of the user
 * @param { String } req.body.email User's email
 * @param { String } req.body.password The user's password
 * @return { Object } User object created
 */
router.post('/', asyncMiddleware(async(req, res) => {
    infoDebugger('Creating new user');
    const { error, value } = joi.userCreateSchema.validate(req.body);
    infoDebugger(value);
    if (error) return res.status(400).send(error);
    // Checking if user already is registered
    const user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('Email already registered.');
    // Creating new user
    const newUser = User(_.pick(req.body, ['name', 'email', 'password']));
    // Generating salt and created a hashed password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    // Generating JWT for the newly registered user
    const token = newUser.generateAuthToken();
    
    await newUser.save();
    res.header('x-auth-token', token).send(_.pick(newUser, ['_id', 'name', 'email']));
    })
);

module.exports = router;