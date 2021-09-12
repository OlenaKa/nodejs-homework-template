const fs = require('fs/promises')

const exists = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const createDir = async (folder) => {
  if (!(await exists(folder))) {
    await fs.mkdir(folder)
  }
}

module.exports = createDir
