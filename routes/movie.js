// APIs
const express = require('express');
const router = express.Router();
// DB
const { Movie } = require('../models/movies');
const { Genre } = require('../models/genres');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Input Validation
const joi = require('../validations/joi_schemas');
// Middleware for validating JWT
const auth = require('../middleware/auth');
// Middleware for validating admin access
const admin = require('../middleware/admin');

/**
 * Fetch all movies 
 * @return { Array } Array of Movie objects
 */
router.get('/', async (req, res) => {
    infoDebugger('Getting all movies...')

    const movies = await Movie.find().sort('name');  
    return res.send(movies);
    }
);

/**
 * Get movie by ID
 * @param { String } req.params.id ID of the requested movie
 * @return { Object } Movie object requested
 */
router.get('/:id', async (req, res) =>{
    infoDebugger('Getting single movie');
    const {error, value } = joi.basicIdSchema.validate(req.params);
    if (error) return res.status(400).send(error);
    infoDebugger(value);
    // Fetching movie
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send(`Movie with ID ${req.params.id} not found.`);
    res.send(movie);
    }
);

/**
 * POST a new movie in the database
 * @param { String } req.body.title The title of the movie to POST
 * @param { ObjectId } req.body.genreId The ID of the genre associated with the movie
 * @param { Number } req.body.numberInStock Number of the movie in stock
 * @param { Number } req.body.dailyRentalRate The daily rental rate of the movie
 * @return { Object } New Movie Object
 */
router.post('/', auth, async (req,res) => {
    // Joi Validation
    const { error, value } = joi.movieCreateSchema.validate(req.body);
    infoDebugger(value);
    if (error) return res.status(400).send(error);

    // Checking that the genre exists
    const genreSelected = await Genre.findById(req.body.genreId);
    if (!genreSelected) return res.status(404).send(`Genre with ID ${req.body.genreId}`)

    // Creating new Movie object
    const newMovie = new Movie({
        title: req.body.title,
        genre: {
            _id: genreSelected._id,
            name: genreSelected.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    // Saving to DB
    const result = await newMovie.save();
    infoDebugger('New Movie Created...\n',result);
    res.send(result)
    }
);

/**
 * Update an existing movie
 * @param { String } req.params.id ID of the movie of update
 * @param { String } req.body.title New title of the movie
 * @param { String } req.body.genreId New genre of the movie
 * @param { Number } req.body.numberInStock New number in stock for the movie
 * @param { Number } req.body.dailyRentalRate New rental rate for the movie
 * @return { Object } New Movie object
 */
router.put('/:id', auth, async (req, res) => {
    infoDebugger('Updating existing movie');
    // Validating the body
    const bodyValidation = joi.movieUpdateSchema.validate(req.body);
    if (bodyValidation.error) return res.status(400).send(bodyValidation.error);
    infoDebugger(bodyValidation.value);
    // Validating the parameter
    const idValidation = joi.basicIdSchema.validate(req.params);
    if (idValidation.error) return res.status(400).send(idValidation.error);
    infoDebugger(idValidation.value);

    // Checking that the genre exists
    var genreProvided = false
    if (req.body.genreId) {
        var genreProvided = true
        var genreSelected = await Genre.findById(req.body.genreId);
        if (!genreSelected) return res.status(404).send(`Genre with ID ${req.body.genreId} does not exist.`)
    }

    // Fetching movie
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send(`Movie with ID ${req.params.id} does not exist.`)
    // Updating values
    movie.title = req.body.title || movie.title;
    if (genreProvided) {
        movie.genre = {_id: genreSelected._id, name: genreSelected.name}
    };
    movie.numberInStock = req.body.numberInStock || movie.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate || movie.dailyRentalRate
    movie.updatedAt = Date.now();
    const updatedMovie = await movie.save();
    res.send(updatedMovie);
    }
);

/**
 * Delete an existing movie
 * @param { String } req.params.id ID of the movie to delete
 * @return { Object } Deleted Movie object
 */
router.delete('/:id', [auth, admin], async (req, res) => {
    infoDebugger('Deleting existing movie');
    const { error, value } = joi.basicIdSchema.validate(req.params);
    if (error) return res.status(400).send(error);
    infoDebugger(value);
    // Fetching and deleting movie
    const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
    if (!deletedMovie) return res.status(404).send(`Movie with ID ${req.params.id} not found.`);
    return res.send(deletedMovie);
    }
);


module.exports = router;