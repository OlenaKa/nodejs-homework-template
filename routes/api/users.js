const express = require('express')
const router = express.Router()
const { signup, login, logout } = require('../../controllers/users-ctrl')
const guard = require('../../helpers/guard')
const { validationUser } = require('../../validation/validationUsers')

router.post('/signup', validationUser, signup)
router.post('/login', validationUser, login)
router.post('/logout', guard, logout)

module.exports = router
