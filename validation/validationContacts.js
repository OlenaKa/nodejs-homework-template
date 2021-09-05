const Joi = require('joi')
const mongoose = require('mongoose')
const { MAIL_REG_EX, HTTP_CODE, PHONE_REX_EX } = require('../helpers/constants')

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.string().pattern(PHONE_REX_EX).required(),
  email: Joi.string().pattern(MAIL_REG_EX).required(),
  favorite: Joi.string().optional(),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  phone: Joi.string().pattern(PHONE_REX_EX).optional(),
  email: Joi.string().pattern(MAIL_REG_EX).optional(),
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
      status: HTTP_CODE.BAD_REQUEST,
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
        status: HTTP_CODE.BAD_REQUEST,
        message: 'ID is not valid',
      })
    }
    next()
  },
}
