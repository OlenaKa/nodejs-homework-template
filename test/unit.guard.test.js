const guard = require('../helpers/guard')
const { HTTP_CODE } = require('../helpers/constants')
const passport = require('passport')

describe('Unit test quard', () => {
  const user = { token: 'someString' }
  const req = { get: jest.fn((header) => `Bearer ${user.token}`), user }
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  }
  const next = jest.fn()
  test('no token', async () => {
    passport.authenticate = jest.fn((strategy, opts, cb) => () => {
      cb(null, { token: false })
    })

    guard(req, res, next)
    expect(req.get).toBeCalled()
    expect(res.status).toBeCalled()
    expect(res.json).toBeCalled()
    expect(res.json).toReturnWith({
      status: 'error',
      code: HTTP_CODE.UNAUTHORIZED,
      message: 'Invalid credentials',
    })
  })

  test('wrong token', async () => {
    passport.authenticate = jest.fn((strategy, opts, cb) => () => {
      cb(null, { token: 'someOtherString' })
    })

    guard(req, res, next)
    expect(req.get).toBeCalled()
    expect(res.status).toBeCalled()
    expect(res.json).toBeCalled()
    expect(res.json).toReturnWith({
      status: 'error',
      code: HTTP_CODE.UNAUTHORIZED,
      message: 'Invalid credentials',
    })
  })

  test('user exists', async () => {
    passport.authenticate = jest.fn((strategy, opts, cb) => () => {
      cb(null, user)
    })
    guard(req, res, next)
    expect(req.get).toBeCalled()
    expect(next).toBeCalled()
  })
})
