const Joi = require('joi');

module.exports.listingschema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    filename: Joi.string().allow("", null),
    url: Joi.string().allow("", null)
}).required();
