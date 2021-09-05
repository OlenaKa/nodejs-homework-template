const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { findUserById } = require('../repositories/users')
require('dotenv').config()
const { SECRET_KEY } = process.env

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = SECRET_KEY

passport.use(
  new JwtStrategy(opts, async function (payload, done) {
    try {
      const user = await findUserById(payload.id)
      if (!user) {
        return done(new Error('User not found'))
      }
      if (!user.token) {
        done(null, false)
      }
      return done(null, user)
    } catch (error) {
      done(err, false)
    }
  })
)
