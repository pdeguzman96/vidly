const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi);

const basicIdSchema = Joi.object({
    id: Joi.objectId()
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

const userCreateSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(4).max(255)
})

function validateUser(req) {
    const schema = Joi.object({
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(4).max(255)
    });
    return schema.validate(req);
}

module.exports.basicIdSchema = basicIdSchema
module.exports.genreNameSchema = genreNameSchema
module.exports.custCreateSchema = custCreateSchema
module.exports.custUpdateSchema = custUpdateSchema
module.exports.movieCreateSchema = movieCreateSchema
module.exports.movieUpdateSchema = movieUpdateSchema
module.exports.rentalCreateSchema = rentalCreateSchema
module.exports.userCreateSchema = userCreateSchema
module.exports.validateUser = validateUser