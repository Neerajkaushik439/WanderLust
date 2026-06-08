const Joi = require('joi');



module.exports.listingschema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
  image: Joi.string().allow("", null),
  guests: Joi.number().integer().min(1).required(),
  bedrooms: Joi.number().integer().min(0).required(),
  bathrooms: Joi.number().integer().min(0).required(),
  amenities: Joi.array().items(Joi.string()).single().optional(),
  category: Joi.string().valid("Trending","Room", "Iconic cities","Mountains","Beach","Castles","Farm","Camping", "Arctic").required()
}).required();



module.exports.reviewschema= Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
})