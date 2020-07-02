const mongoose = require('mongoose');

// Setting a reduced version of the Movie and Customer schemas
const reducedMovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 300
    }
});
const reducedCustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    }
})

// Rental schema
const rentalSchema = new mongoose.Schema({
    movie: {
        type: reducedMovieSchema,
        required: true
    },
    customer: {
        type: reducedCustomerSchema,
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now()
    },
    dateReturned: Date,
    rentalFee: {
        type: Number,
        min: 0
    }
})

const Rental = new mongoose.model("Rental", rentalSchema);

exports.Rental = Rental;
exports.rentalSchema = rentalSchema;