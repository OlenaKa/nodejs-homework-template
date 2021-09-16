const mongoose = require('mongoose')
require('dotenv').config()

const { URI_DB, URI_DB_TEST } = process.env
const connectionLink = process.env.NODE_ENV === 'test' ? URI_DB_TEST : URI_DB

const db = mongoose.connect(connectionLink)

mongoose.connection.on('connected', () => {
  console.log(`Database connection successful`)
})

mongoose.connection.on('error', (e) => {
  console.log(`Error in connection to mdb ${e.message}`)
})

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log(`Connection to db terminated`)
    process.exit(1)
  })
})

module.exports = db
