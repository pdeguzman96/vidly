const mongoose = require('mongoose');

const Customer = new mongoose.model("Customer", 
new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean,
        required: true,
        default: false
    },
    phone: {
        type: String
    },
    createdAt: { 
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
}));

exports.Customer = Customer;