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
// Lodash
const _ = require('lodash');

/**
 * Get all users
 * @return { Array } Array of User objects
 */
router.get('/', async (req, res) => {
    infoDebugger('Getting all users...');
    try {
        const users = await User.find().sort('email');
        return res.send(users);
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(500).send(ex);
    }
})

/**
 * Get user by ID
 * @param { String } req.params.id ID of the requested user
 * @return { Object } User object requested
 */
router.get('/:id', async (req, res) =>{
    infoDebugger('Getting single user');
    const {error, value } = joi.basicIdSchema.validate(req.params);
    if (error) return res.status(400).send(error);
    infoDebugger(value);

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send(`user with ID ${req.params.id} not found.`);
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
        await newUser.save();
        res.send(_.pick(newUser, ['_id', 'name', 'email']));
    }

    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex);
    }
});

module.exports = router;