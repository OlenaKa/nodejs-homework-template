const User = require('../model/user')

const findUserById = async (id) => {
  return await User.findById(id)
}

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email })
  return user
}

const createUser = async (body) => {
  const user = new User(body)
  return await user.save()
}
const updateToken = async (id, token) => {
  return await User.findByIdAndUpdate({ _id: id }, { token })
}

const updateUserSubsrciption = async (id, body) => {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { subscription: body.subscription },
    { new: true, runValidators: true }
  )
  return user
}
module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
  updateToken,
  updateUserSubsrciption,
}
