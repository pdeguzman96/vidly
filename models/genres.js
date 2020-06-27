const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})

const Genre = new mongoose.model("Genre", genreSchema);

exports.Genre = Genre;
exports.genreSchema = genreSchema;