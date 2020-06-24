const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const infoDebugger = require('debug')('app:info')
const configDebugger = require('debug')('app:config')
const errDebugger = require('debug')('app:err')
const mongoose = require('mongoose')

/**
 * Fetch all genres
 * @return { Array } Array of Genre objects
 */
router.get('/', (req, res) => {
    db.Genre.find()
        .then( genres => res.send(genres))
        .catch( err => errDebugger(err))
});

/**
 * Fetch one genre
 * @param { String } id query string | MongoDB ID for the requested genre
 * @return { Object } Genre Object
 */
router.get('/:id', (req,res) => {
    db.Genre.findById(req.params.id)
        .then(genre => {
            if (!genre)
                res.sendStatus(404);
            res.send(genre);
        })
        .catch(err => errDebugger(err))
});

/**
 * POST a new genre in the database
 * @param { String } req.body.name json body param | The name of the genre to POST 
 * @return { Object } New Genre Object
 */
router.post('/', (req,res) => {
    const newGenre = {name: req.body.name}
    infoDebugger('New Genre Object:',newGenre)
    db.createGenre(newGenre)
        .then( genre => res.send(genre) )
        .catch( err => errDebugger(err) )
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
    db.Genre.findOneAndUpdate(updateTarget, updateObj, {new: true})
        .then( updatedGenre => {
            if (!updatedGenre)
                res.sendStatus(404);
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
    db.Genre.findByIdAndRemove({ _id: req.params.id })
        .then( deletedGenre => {
            if (!deletedGenre)
                res.sendStatus(404);
            res.send(deletedGenre);
        })
        .catch( err => errDebugger(err));
});

module.exports = router;