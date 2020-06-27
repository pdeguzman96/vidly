// APIs
const express = require('express');
const router = express.Router();
// DB
const db = require('../db/db.js')
const mongoose = require('mongoose')
// Logging
const infoDebugger = require('debug')('app:info')
const configDebugger = require('debug')('app:config')
const errDebugger = require('debug')('app:err')
// Input Validation
const joi = require('../joi_schemas')

// Compile schema into a model
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
        created_at: { 
            type: Date,
            default: Date.now()
        },
        updated_at: Date
    }));

/**
 * Get all customers
 * @return { Array } Array of Customer objects
 */
router.get('/', async(req, res) => {
    infoDebugger('Getting all customers...');
    try {
        const customers = await Customer.find().sort('name');
        res.send(customers);
    }
    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex);
    }
})

/**
 * Create a new customer
 * @param { String } req.body.name Name of the customer
 * @param { Boolean } req.body.isGold Whether the customer is a gold member
 * @param { String } req.body.phone The customer's phone number
 * @return { Object } Customer object created
 */
router.post('/', async(req, res) => {
    infoDebugger('Creating new customer');
    const { error, value } = joi.cust_create_schema.validate(req.body);
    infoDebugger(value);
    if (error) return res.status(400).send(error);

    try {
        const newCustomer = Customer({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });
        const result = await newCustomer.save();
        res.send(result);
    }

    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex);
    }
})

module.exports = router;