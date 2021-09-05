const passport = require('passport')
require('../config/passport')
const { HTTP_CODE } = require('../helpers/constants')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const authHeader = req.get('Authorization')
    let token = null
    if (authHeader) {
      token = authHeader.split(' ')[1]
    }
    if (err || !user || token !== user.token) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({
        status: 'error',
        code: HTTP_CODE.UNAUTHORIZED,
        message: 'Invalid credentials',
      })
    }

    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
