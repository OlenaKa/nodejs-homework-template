const Joi = require('joi')
const { MAIL_REG_EX, HTTP_CODE } = require('../helpers/constants')

const schemaUser = Joi.object({
  email: Joi.string().pattern(MAIL_REG_EX).required(),
  password: Joi.string().min(6).required(),
})

const schemaSubscription = Joi.object({
  subscription: Joi.string()
    .pattern(/^(starter|pro|business)$/)
    .required(),
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
  validationUser: (req, _res, next) => {
    return validate(schemaUser, req.body, next)
  },
  validationSubscription: (req, _res, next) => {
    return validate(schemaSubscription, req.body, next)
  },
}
