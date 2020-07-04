// APIs
const express = require('express');
const router = express.Router();
// DB Model
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customers');
const mongoose = require('mongoose');
const db = require('../db/db');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Input Validation
const joi = require('../joi_schemas');
// Two-Phase Commits
const Fawn = require('fawn');
Fawn.init(mongoose);
// Middleware for validating JWT
const auth = require('../middleware/auth');

/**
 * Get all rentals
 * @return { Array } Array of Rental objects
 */
router.get('/', async (req, res) => {
    infoDebugger('Getting all rentals...');
    try {
        const rentals = await Rental.find().sort('-dateOut');
        return res.send(rentals);
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(500).send(ex);
    }
})

/**
 * Create a new rental. Make sure customer and movie exist, and automatically decrement the movie
 * @param { Object } req.body.customerId ID of the customer
 * @param { Object } req.body.movieId ID of the movie
 * @return { Object } Containing both the new rental and the decremented movie
 */
router.post('/', auth, async (req, res) => {
    infoDebugger('Creating new rental...');
    // Joi input validation
    const { error, value } = joi.rentalCreateSchema.validate(req.body);
    if (error) return res.status(400).send(error);
    infoDebugger(value);

    // Checking if movie exists and contains stock
    const selectedMovie = await Movie.findById(req.body.movieId);
    if (!selectedMovie) return res.status(404).send(`Movie with ID ${req.body.movieId} does not exist.`);
    if (selectedMovie.numberInStock === 0) res.status(400).send(`Movie with ID ${req.body.movieId} does not have any movies in stock.`);

    // Checking if customer exists
    const selectedCustomer = await Customer.findById(req.body.customerId);
    if (!selectedCustomer) return res.status(404).send(`Customer with ID ${req.body.customerId} does not exist.`);

    try {
        const newRental = new Rental({
            movie: {
                _id: selectedMovie._id,
                title: selectedMovie.title,
                dailyRentalRate: selectedMovie.dailyRentalRate
            },
            customer: {
                _id: selectedCustomer._id,
                name: selectedCustomer.name,
                phone: selectedCustomer.phone,
                isGold: selectedCustomer.isGold
            }
        });

        try {
            new Fawn.Task()
                .save('rentals', newRental)
                .update('movies', 
                    {_id: selectedMovie._id}, 
                    {$inc: { numberInStock: -1 }})
                .run();
            res.send(newRental);
        }
        catch (ex) {
            errDebugger(ex);
            return res.status(500).send(ex);
        }

        infoDebugger('New Rental Created...\n',newRental);
        return 
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(500).send(ex);
    }
})

module.exports = router;