const { verify } = require('jsonwebtoken')
const User = require('../model/user')

const findUserById = async (id) => {
  return await User.findById(id)
}

const findUserByVfToken = async (verifyToken) => {
  return await User.findOne({ verifyToken })
}

const findUserByEmail = async (email) => {
  return await User.findOne({ email })
}

const createUser = async (body) => {
  const user = new User(body)
  return await user.save()
}
const updateToken = async (id, token) => {
  return await User.findByIdAndUpdate({ _id: id }, { token })
}

const updateVfToken = async (id, verify, verifyToken) => {
  return await User.findByIdAndUpdate({ _id: id }, { verify, verifyToken })
}

const updateUserSubsrciption = async (id, body) => {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { subscription: body.subscription },
    { new: true, runValidators: true }
  )
  return user
}

const updateUserAvatar = async (id, avatarUrl) => {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { avatarUrl: avatarUrl },
    { new: true }
  )
  return user
}
module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateToken,
  updateUserSubsrciption,
  updateUserAvatar,
  findUserByVfToken,
  updateVfToken,
}
