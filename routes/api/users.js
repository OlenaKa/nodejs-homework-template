const express = require('express')
const router = express.Router()
const {
  signup,
  login,
  logout,
  updateSubsrciption,
  getCurrentUser,
  avatars,
} = require('../../controllers/users-ctrl')
const guard = require('../../helpers/guard')
const {
  validationUser,
  validationSubscription,
} = require('../../validation/validationUsers')

const upload = require('../../helpers/upload')

router.post('/signup', validationUser, signup)
router.post('/login', validationUser, login)
router.post('/logout', guard, logout)
router.get('/current', guard, getCurrentUser)
router.patch('/', guard, validationSubscription, updateSubsrciption)
router.patch('/avatars', guard, upload.single('avatar'), avatars)

module.exports = router
