const Joi = require('@hapi/joi')

const basic_id_schema = Joi.object({
    id: Joi.string()
        .alphanum()
        .length(24)
        .required()
});

const genre_name_schema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(20)
        .required()
});

const cust_create_schema = Joi.object({
    name: Joi.string()
        .required(),
    isGold: Joi.boolean(),
    phone: Joi.string()
});

const cust_update_schema = Joi.object({
    name: Joi.string(),
    isGold: Joi.boolean(),
    phone: Joi.string()
});

module.exports.basic_id_schema = basic_id_schema
module.exports.genre_name_schema = genre_name_schema
module.exports.cust_create_schema = cust_create_schema
module.exports.cust_update_schema = cust_update_schema