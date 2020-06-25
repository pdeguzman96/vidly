const express = require('express');
const router = express.Router();
const db = require('../db/db.js')
const infoDebugger = require('debug')('app:info')
const configDebugger = require('debug')('app:config')
const errDebugger = require('debug')('app:err')
const mongoose = require('mongoose')

// Compiline schema into a model
const Genre = new mongoose.model("Genre", 
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        created_at: { 
            type: Date,
            default: Date.now()
        },
        updated_at: Date
    }));

/**
 * Utility Function to create a new instance of a Genre
 * @param { Object } genreObj An object with property name to indicate genre name
 */
async function createGenre(genreObj){
    try {
        const newGenre = new Genre(genreObj);
        const result = await newGenre.save();
        infoDebugger('New Genre Created...\n',result);
        return result
    }
    catch (ex) {
        errDebugger(ex);
        return
    }
}

/**
 * Fetch all genres
 * @return { Array } Array of Genre objects
 */
router.get('/', async (req, res) => {
    infoDebugger('GETTING ALL GENRES')
    try { 
        const genres = await Genre.find().sort('name');  
        res.send(genres)
    }
    catch (ex) {
        errDebugger(ex);
        return
    }
    
});

/**
 * Fetch one genre
 * @param { String } id query string | MongoDB ID for the requested genre
 * @return { Object } Genre Object
 */
router.get('/:id', async (req,res) => {
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
router.post('/', (req,res) => {
    const newGenre = {name: req.body.name}
    infoDebugger('New Genre Object:',newGenre)
    createGenre(newGenre)
        .then( genre => res.send(genre) )
        .catch( err => {
            errDebugger(err);
            res.status(500).send('Error occurred while POST-ing genre.');
        } )
});

/**
 * Update an existing genre
 * @param { String } id query string | id of the genre to update
 * @param { String } name json body param | new name of the genre
 * @return { Object } Updated Genre Object
 */
router.put('/:id', (req,res) => {
    const updateTarget = {_id : req.params.id}
    const updateObj = {
        $set: {
            name: req.body.name,
            updated_at: Date.now()
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
    Genre.findByIdAndRemove({ _id: req.params.id })
        .then( deletedGenre => {
            if (!deletedGenre) return res.status(404).send(`Genre with ID ${req.params.id} not found.`);
            res.send(deletedGenre);
        })
        .catch( err => errDebugger(err));
});

module.exports = router;