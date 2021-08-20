const Joi = require('joi');

const validationCreateContacts = Joi.object({
 name: Joi.string()
    .pattern(/^[a-zA-Z' '\-()0-9]{3,30}$/)
    .required(),
  
  phone: Joi.string()
    .pattern(/^[' '\-()0-9]{3,30}$/)
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
});

const validationUpdateContacts = Joi.object({
 name: Joi.string()
    .pattern(/^[a-zA-Z' '\-()0-9]{3,30}$/)
    .optional(),
  
  phone: Joi.string()
    .pattern(/^[' '\-()0-9]{3,30}$/)
    .optional(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional()
}).or('name', 'phone', 'email')

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  }
  catch (err) {
    next({
      status: 400,
      message: err.message,
    })
  }
};

module.exports = {
  createContact: (req, res, next) => {
    return validate(validationCreateContacts, req.body, next)
  },
  updateContact: (req, res, next) => {
    return validate(validationUpdateContacts, req.body, next)
  },
};
    
