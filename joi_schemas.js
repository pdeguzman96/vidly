const Joi = require('@hapi/joi')

const genre_id_schema = Joi.object({
    id: Joi.string()
        .alphanum()
        .length(24)
        .required()
});

const genre_name_schema = Joi.object({
    name: Joi.string()
    .alphanum()
    .min(2)
    .max(20)
    .required()
});

module.exports.genre_id_schema = genre_id_schema
module.exports.genre_name_schema = genre_name_schema