// APIs
const express = require('express');
const router = express.Router();
// DB Model
const { Customer } = require('../models/customers');
const db = require('../db/db');
// Logging
const infoDebugger = require('debug')('app:info');
const errDebugger = require('debug')('app:err');
// Input Validation
const joi = require('../joi_schemas');
// Lodash
const _ = require('lodash');
// Middleware for validating JWT
const auth = require('../middleware/auth');
// Middleware for validating admin access
const admin = require('../middleware/admin');

/**
 * Get all customers
 * @return { Array } Array of Customer objects
 */
router.get('/', async (req, res) => {
    infoDebugger('Getting all customers...');
    try {
        const customers = await Customer.find().sort('name');
        return res.send(customers);
    }
    catch (ex) {
        errDebugger(ex);
        return res.status(500).send(ex);
    }
})

/**
 * Get customer by ID
 * @param { String } req.params.id ID of the requested customer
 * @return { Object } Customer object requested
 */
router.get('/:id', async (req, res) =>{
    infoDebugger('Getting single customer');
    const {error, value } = joi.basicIdSchema.validate(req.params);
    if (error) return res.status(400).send(error);
    infoDebugger(value);

    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send(`Customer with ID ${req.params.id} not found.`);
        res.send(customer);
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
router.post('/', auth, async(req, res) => {
    infoDebugger('Creating new customer');
    const { error, value } = joi.custCreateSchema.validate(req.body);
    infoDebugger(value);
    if (error) return res.status(400).send(error);

    try {
        const newCustomer = Customer(_.pick(req.body, ['name', 'isGold', 'phone']));
        const result = await newCustomer.save();
        res.send(result);
    }

    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex);
    }
});

/**
 * Update an existing customer
 * @param { String } req.params.id ID of the customer of update
 * @param { String } req.body.name New name of the customer
 * @param { Boolean } req.body.isGold New membership flag for the customer
 * @param { String } req.body.phone New phone number of the customer
 * @return { Object } New Customer object
 */
router.put('/:id', auth, async (req, res) => {
    infoDebugger('Updating existing customer');
    // Validating the body
    const bodyValidation = joi.custUpdateSchema.validate(req.body);
    if (bodyValidation.error) return res.status(400).send(bodyValidation.error);
    infoDebugger(bodyValidation.value);
    // Validating the parameter
    const idValidation = joi.basicIdSchema.validate(req.params);
    if (idValidation.error) return res.status(400).send(idValidation.error);
    infoDebugger(idValidation.value);

    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send(`Customer with ID ${req.params.id} does not exist.`)

        customer.name = req.body.name || customer.name;
        if (req.body.isGold !== undefined) customer.isGold = req.body.isGold;
        customer.phone = req.body.phone || customer.phone;
        customer.updatedAt = Date.now();
        const updatedCustomer = await customer.save();
        res.send(updatedCustomer);
    }

    catch (ex) {
        errDebugger(ex);
        res.status(400).send(ex);
    }

});

/**
 * Delete an existing customer
 * @param { String } req.params.id ID of the customer to delete
 * @return { Object } Deleted customer object
 */
router.delete('/:id', [auth, admin], async (req, res) => {
    infoDebugger('Deleting existing customer');
    const { error, value } = joi.basicIdSchema.validate(req.params);
    if (error) return res.status(400).send(error);
    infoDebugger(value);

    try {
        const deletedCustomer = await Customer.findByIdAndRemove(req.params.id);
        if (!deletedCustomer) return res.status(404).send(`Customer with ID ${req.params.id} not found.`);
        return res.send(deletedCustomer);
    }

    catch (ex) {
        errDebugger(ex);
        res.status(500).send(ex);
    }
})

module.exports = router;