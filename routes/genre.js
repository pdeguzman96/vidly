// APIs
const express = require('express');
const router = express.Router();
// DB
const { Genre } = require('../models/genres');
const db = require('../db/db');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Input Validation
const joi = require('../joi_schemas');
// Middleware for validating JWT
const auth = require('../middleware/auth');

/**
 * Fetch all genres
 * @return { Array } Array of Genre objects
 */
router.get('/', async (req, res) => {
    infoDebugger('Getting all genres...')
    try { 
        const genres = await Genre.find().sort('name');  
        return res.send(genres);
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(500).send(ex);
    }
    
});

/**
 * Fetch one genre
 * @param { String } id query string | MongoDB ID for the requested genre
 * @return { Object } Genre Object
 */
router.get('/:id', async (req,res) => {
    // Joi Validation
    const { error, value } = joi.basicIdSchema.validate(req.params);
    infoDebugger(value);
    if (error) return res.status(400).send(error);

    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send(`Genre with ID ${req.params.id} not found.`);
        res.send(genre);
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(500).send('Error occurred while fetching genre.');
    }
});

/**
 * POST a new genre in the database
 * @param { String } req.body.name json body param | The name of the genre to POST 
 * @return { Object } New Genre Object
 */
router.post('/', auth, async (req,res) => {
    // Joi Validation
    const { error, value } = joi.genreNameSchema.validate(req.body);
    infoDebugger(value);
    if (error) return res.status(400).send(error);

    try {
        const newGenre = new Genre({
            name: req.body.name
        });
        const result = await newGenre.save();
        infoDebugger('New Genre Created...\n',result);
        res.send(result)
    }
    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex)
    }
});

/**
 * Update an existing genre
 * @param { String } id query string | id of the genre to update
 * @param { String } name json body param | new name of the genre
 * @return { Object } Updated Genre Object
 */
router.put('/:id', (req,res) => {
    // Joi Validation - ID
    let id_res = joi.basicIdSchema.validate(req.params);
    if (id_res.error) return res.status(400).send(id_res.error);
    // Joi Validation - Name
    let name_res = joi.genreNameSchema.validate(req.body);
    if (name_res.error) return res.status(400).send(name_res.error);
    
    const updateTarget = {_id : req.params.id}
    const updateObj = {
        $set: {
            name: req.body.name,
            updatedAt: Date.now()
        }
    }
    Genre.findOneAndUpdate(updateTarget, updateObj, {new: true})
        .then( updatedGenre => {
            if (!updatedGenre) return res.status(404).send(`Genre with ID ${req.params.id} not found.`);
            res.send(updatedGenre);
        } )
        .catch( err => errDebugger(err));
});

/**
 * Remove Genre by ID
 * @param { String } id query string | MongoDB ID for the genre to delete
 * @return { Object } Deleted Genre object
 */
router.delete('/:id', (req,res) => {
    // Joi Validation - ID
    const { error, value } = joi.basicIdSchema.validate(req.params);
    infoDebugger(value);
    if (error) return res.status(400).send(error);

    Genre.findByIdAndRemove({ _id: req.params.id })
        .then( deletedGenre => {
            if (!deletedGenre) return res.status(404).send(`Genre with ID ${req.params.id} not found.`);
            res.send(deletedGenre);
        })
        .catch( err => errDebugger(err));
});

module.exports = router;