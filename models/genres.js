const mongoose = require('mongoose');

const Genre = new mongoose.model("Genre", 
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        createdAt: { 
            type: Date,
            default: Date.now()
        },
        updatedAt: Date
    }));

    exports.Genre = Genre;