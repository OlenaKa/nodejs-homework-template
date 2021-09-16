const multer = require('multer')
const { UPLOAD_DIR } = require('./constants')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now().toString()}-${file.originalname}`
    cb(null, fileName)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
      return
    }
    const error = new Error('Wrong file format')
    error.status = 400
    cb(error)
  },
})

module.exports = upload
