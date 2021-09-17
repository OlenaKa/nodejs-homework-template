require('dotenv').config()
const { SECRET_KEY } = process.env
const { HTTP_CODE } = require('../helpers/constants')
const {
  findUserByEmail,
  createUser,
  updateToken,
  updateUserSubsrciption,
  findUserById,
  updateUserAvatar,
  findUserByVfToken,
  updateVfToken,
} = require('../repositories/users')
const VerificationEmailService = require('../services/email')
const jwt = require('jsonwebtoken')
const saveNewAvatar = require('../services/avatar-transform')
const deleteOldAvatar = require('../helpers/delete-avatar')

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
    const { id, email, subscription, avatarUrl, verifyToken } =
      await createUser(req.body)

    try {
      const verification = new VerificationEmailService(process.env.NODE_ENV)
      await verification.sendVfEmail(verifyToken, email)
    } catch (error) {
      console.log(error.message)
    }

    return res.status(HTTP_CODE.CREATED).json({
      status: 'success',
      code: HTTP_CODE.CREATED,
      data: { id, email, subscription, avatarUrl },
    })
  } catch (e) {
    next(e)
  }
}

const emailVerification = async (req, res, next) => {
  try {
    const user = await findUserByVfToken(req.params.verificationToken)
    if (user) {
      await updateVfToken(user.id, true, null)
      return res.status(HTTP_CODE.OK).json({
        status: 'success',
        code: HTTP_CODE.OK,
        message: 'Your email is successfully verified',
      })
    }
    return res.status(HTTP_CODE.NOT_FOUND).json({
      status: 'error',
      code: HTTP_CODE.NOT_FOUND,
      message: 'User not found',
    })
  } catch (error) {
    next(error)
  }
}

const repeatEmailVerification = async (req, res, next) => {
  try {
    const { verify, verifyToken } = await findUserByEmail(req.body.email)
    if (verify) {
      return res.status(HTTP_CODE.CONFLICT).json({
        status: 'error',
        code: HTTP_CODE.CONFLICT,
        message: 'Email is already verified',
      })
    }
    const verification = new VerificationEmailService(process.env.NODE_ENV)
    await verification.sendVfEmail(verifyToken, req.body.email)
    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      message: 'Verification e-mail sent',
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email)
    const validPassword = await user?.isValidPassword(req.body.password)
    if (!user || !validPassword || !user.verify) {
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
    const { email, subscription, avatarUrl } = user
    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: { email, subscription, avatarUrl },
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

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const newAvatar = await saveNewAvatar({ userId: id, file: req.file })
    const { _id, email, subscription, avatarUrl } = await updateUserAvatar(
      id,
      newAvatar
    )
    await deleteOldAvatar(req.user.avatarUrl)

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: { _id, email, subscription, avatarUrl },
    })
  } catch (e) {
    next(e)
  }
}
module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateSubsrciption,
  avatars,
  emailVerification,
  repeatEmailVerification,
}
