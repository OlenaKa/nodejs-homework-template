const express = require('express')
const router = express.Router()
const {
  signup,
  login,
  logout,
  updateSubsrciption,
  getCurrentUser,
  avatars,
  emailVerification,
  repeatEmailVerification,
} = require('../../controllers/users-ctrl')
const guard = require('../../helpers/guard')
const {
  validationUser,
  validationSubscription,
  validationRepeatEmailVerification,
} = require('../../validation/validationUsers')

const upload = require('../../helpers/upload')

router.post('/signup', validationUser, signup)
router.post('/login', validationUser, login)
router.post('/logout', guard, logout)
router.get('/current', guard, getCurrentUser)

router.patch('/', guard, validationSubscription, updateSubsrciption)
router.patch('/avatars', guard, upload.single('avatar'), avatars)

router.get('/verify/:verificationToken', emailVerification)
router.post(
  '/verify',
  validationRepeatEmailVerification,
  repeatEmailVerification
)

module.exports = router
