const mongoose = require('mongoose')
require('dotenv').config()

const { URI_DB } = process.env

const db = mongoose.connect(URI_DB)

mongoose.connection.on('connected', () => {
  console.log(`Database connection successful`)
})

mongoose.connection.on('error', (e) => {
  console.log(`Error in connection to mdb ${e.message}`)
})

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log(`Connection to db npterminated`)
    process.exit(1)
  })
})

module.exports = db
