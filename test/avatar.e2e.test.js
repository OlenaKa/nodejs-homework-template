const request = require('supertest')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = require('../app')
const db = require('../model/db')
const User = require('../model/user')
const fs = require('fs/promises')
const path = require('path')
const { updateToken } = require('../repositories/users')
const { HTTP_CODE } = require('../helpers/constants')

jest.mock('../services/avatar-transform')

const newUser = {
  password: '123456',
  email: 'test@test.com',
  subscription: 'starter',
  token: null,
  avatarUrl: 'someString',
}

describe('update avatar', () => {
  let user, token
  beforeAll(async () => {
    await db
    await User.deleteOne({ email: `${newUser.email}` })
    user = await User.create(newUser)
    const SECRET_KEY = process.env.SECRET_KEY
    token = jwt.sign({ id: user.id }, SECRET_KEY)
    await updateToken(user.id, token)
  })

  afterAll(async () => {
    const database = await db
    await User.deleteOne({ email: `${newUser.email}` })
    await database.disconnect()
    const files = await fs.readdir('tmp')
    files?.forEach(async (file) => await fs.unlink(path.join('tmp', file)))
  })

  test('user with invalid token', async () => {
    const response = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Invalid token`)
      .attach('avatar', './test/avatars/monster-fun.jpg')
    expect(response.status).toEqual(HTTP_CODE.UNAUTHORIZED)
    expect(response.body).toBeDefined()
  })

  test('user with ok token', async () => {
    const response = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', './test/avatars/monster-fun.jpg')

    expect(response.status).toEqual(HTTP_CODE.OK)
    expect(response.body).toBeDefined()
    expect(response.body.data.avatarUrl).toEqual('newPath')
  })
})
