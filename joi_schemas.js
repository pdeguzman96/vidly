const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi);

const basicIdSchema = Joi.object({
    id: Joi.string()
        .alphanum()
        .length(24)
        .required()
});

const genreNameSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(20)
        .required()
});

const custCreateSchema = Joi.object({
    name: Joi.string()
        .required(),
    isGold: Joi.boolean(),
    phone: Joi.string()
});

const custUpdateSchema = Joi.object({
    name: Joi.string(),
    isGold: Joi.boolean(),
    phone: Joi.string()
});

const movieUpdateSchema = Joi.object({
    title: Joi.string(),
    genreId: Joi.objectId(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0)
});

const movieCreateSchema = Joi.object({
    title: Joi.string().required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0)
});

const rentalCreateSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
})

module.exports.basicIdSchema = basicIdSchema
module.exports.genreNameSchema = genreNameSchema
module.exports.custCreateSchema = custCreateSchema
module.exports.custUpdateSchema = custUpdateSchema
module.exports.movieCreateSchema = movieCreateSchema
module.exports.movieUpdateSchema = movieUpdateSchema
module.exports.rentalCreateSchema = rentalCreateSchema