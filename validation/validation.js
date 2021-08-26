const Joi = require('joi')
const mongoose = require('mongoose')

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string()
    .pattern(/(\([0-9]{3}\) )[0-9]{3}-[0-9]{4}$/)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'uk', 'ca'] },
    })
    .required(),
  favorite: Joi.string().optional(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  phone: Joi.string()
    .pattern(/(\([0-9]{3}\) )[0-9]{3}-[0-9]{4}$/)
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'uk', 'ca'] },
    })
    .optional(),
  favorite: Joi.string().optional(),
}).or('name', 'phone', 'email', 'favorite')

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.string().required(),
})

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    next()
  } catch (err) {
    next({
      status: 400,
      message: err.message.replace(/"/g, ''),
    })
  }
}

module.exports = {
  validationCreateContact: (req, _, next) => {
    return validate(schemaCreateContact, req.body, next)
  },
  validationUpdateContact: (req, _, next) => {
    return validate(schemaUpdateContact, req.body, next)
  },
  validationUpdateStatusContact: (req, _, next) => {
    return validate(schemaUpdateStatusContact, req.body, next)
  },
  validationID: (req, _, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: 400,
        message: 'ID is not valid',
      })
    }
    next()
  },
}
