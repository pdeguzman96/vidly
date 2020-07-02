const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    isGold: {
        type: Boolean,
        required: true,
        default: false
    },
    phone: {
        type: String,
        minlength: 5,
        maxlength: 30
    },
    createdAt: { 
        type: Date,
        default: Date.now()
    },
    updatedAt: Date
})

const Customer = new mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
exports.customerSchema = customerSchema;