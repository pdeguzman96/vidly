const mongoose = require('mongoose');
const { genreSchema } = require('./genres');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 300
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 300
    },
    createdAt: { 
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})

const Movie = new mongoose.model("Movie", movieSchema);

exports.Movie = Movie;
exports.movieSchema = movieSchema;