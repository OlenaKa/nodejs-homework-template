const path = require('path')
const fs = require('fs/promises')

const exists = async (filePath) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const deleteOldAvatar = async (filePath) => {
  const file = await exists(path.join('public/avatars', filePath))
  if (!file) {
    return
  }
  fs.unlink(path.join('public/avatars', filePath))
}

module.exports = deleteOldAvatar
