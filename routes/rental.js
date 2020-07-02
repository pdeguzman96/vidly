// APIs
const express = require('express');
const router = express.Router();
// DB Model
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customers');
const db = require('../db/db');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Input Validation
const joi = require('../joi_schemas');

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
router.post('/', async (req, res) => {
    infoDebugger('Creating new rental...');
    
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
        const createdRental = await newRental.save();
        infoDebugger('New Rental Created...\n',createdRental);
        
        // Decrementing the Movie stock count
        selectedMovie.numberInStock--
        const updatedMovie = await selectedMovie.save();

        res.send({
            "newRental": createdRental,
            "updatedMovie": updatedMovie
        });
        return 
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(500).send(ex);
    }
})

module.exports = router;