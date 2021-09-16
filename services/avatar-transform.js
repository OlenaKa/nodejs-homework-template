const jimp = require('jimp')
const path = require('path')
const fs = require('fs/promises')
const createDir = require('../helpers/create-dir')
const { AVATARS_REPO } = require('../helpers/constants')

const transformAvatar = async (file) => {
  const img = await jimp.read(file)
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(file)
}

const saveNewAvatar = async ({ userId, file }) => {
  await transformAvatar(file.path)
  const userFolder = path.join(AVATARS_REPO, userId)
  await createDir(userFolder)
  await fs.rename(file.path, path.join(userFolder, file.filename))
  return path.normalize(path.join(userId, file.filename))
}

module.exports = saveNewAvatar
