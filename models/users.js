const mongoose = require('mongoose');

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

const User = new mongoose.model("User", userSchema);

exports.User = User;