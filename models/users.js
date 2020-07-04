const mongoose = require('mongoose');
// For generating JWTs for registered users
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024
    },
    createdAt: { 
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})

/**
 * Generate a JWT token for an authenticated user.
 * @return { String } Json web token
 */
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {_id: this._id}, // payload
        config.get('jwtPrivateKey') // private key from env
        );
};

const User = new mongoose.model("User", userSchema);

exports.User = User;