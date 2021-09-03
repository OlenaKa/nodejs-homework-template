const Joi = require('joi')
// const mongoose = require('mongoose')

const MAIL_REG_EX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const schemaUser = Joi.object({
  email: Joi.string().pattern(MAIL_REG_EX).required(),
  password: Joi.string().min(6).required(),
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
  validationUser: (req, _, next) => {
    return validate(schemaUser, req.body, next)
  },
  // validationUpdateContact: (req, _, next) => {
  //   return validate(schemaUpdateContact, req.body, next)
  // },
  // validationUpdateStatusContact: (req, _, next) => {
  //   return validate(schemaUpdateStatusContact, req.body, next)
  // },
  // validationID: (req, _, next) => {
  //   if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
  //     return next({
  //       status: 400,
  //       message: 'ID is not valid',
  //     })
  //   }
  //   next()
  // },
}
