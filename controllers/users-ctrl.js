require('dotenv').config()
const { SECRET_KEY } = process.env
const { HTTP_CODE } = require('../helpers/constants')
const {
  findUserByEmail,
  createUser,
  updateToken,
  updateUserSubsrciption,
  findUserById,
} = require('../repositories/users')
const jwt = require('jsonwebtoken')

const signup = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email)
    if (user) {
      return res.status(HTTP_CODE.CONFLICT).json({
        status: 'error',
        code: HTTP_CODE.CONFLICT,
        message: 'Email is already used',
      })
    }
    const { id, email, subscription } = await createUser(req.body)
    return res.status(HTTP_CODE.CREATED).json({
      status: 'success',
      code: HTTP_CODE.CREATED,
      data: { id, email, subscription },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email)
    const validPassword = await user?.isValidPassword(req.body.password)
    if (!user || !validPassword) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({
        status: 'error',
        code: HTTP_CODE.UNAUTHORIZED,
        message: 'Invalid credentials',
      })
    }

    const { id } = user
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '5h' })
    await updateToken(id, token)
    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: { token },
    })
  } catch (e) {
    next(e)
  }
}
const logout = async (req, res, next) => {
  try {
    const { id } = req.user
    await updateToken(id)
    res.status(HTTP_CODE.NO_CONTENT).json()
  } catch (e) {
    next(e)
  }
}
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await findUserById(userId)

    if (!user) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({
        status: 'error',
        code: HTTP_CODE.UNAUTHORIZED,
        message: 'Not authorized',
      })
    }
    const { email, subscription } = user
    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: { email, subscription },
    })
  } catch (e) {
    next(e)
  }
}

const updateSubsrciption = async (req, res, next) => {
  try {
    const userId = req.user.id
    const user = await updateUserSubsrciption(userId, req.body)
    const { id, email, subscription } = user
    if (user) {
      return res.status(HTTP_CODE.OK).json({
        status: 'success',
        code: HTTP_CODE.OK,
        data: { id, email, subscription },
      })
    }
    return res.status(HTTP_CODE.NOT_FOUND).json({
      status: 'error',
      code: HTTP_CODE.NOT_FOUND,
      message: 'Not found',
    })
  } catch (e) {
    next(e)
  }
}

module.exports = { signup, login, logout, getCurrentUser, updateSubsrciption }
