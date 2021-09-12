const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users')
const app = express()
const path = require('path')

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public/avatars')))

app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const status = err.status || 500
  const responseStatus = status === 500 ? 'fail' : 'error'
  res
    .status(status)
    .json({ status: responseStatus, code: status, message: err.message })
})

module.exports = app
