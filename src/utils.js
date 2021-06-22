const createHash = require('create-hash')
const path = require('path')
const fs = require('fs')

function getManifestPath () {
  const fileName = 'build-change-webpack-plugin-manifest.json'
  const filePath = path.resolve(process.cwd(), `./node_modules/.cache/${fileName}`)
  return filePath
}

function getHash (content, length = 32) {
  const hash = createHash('sha512')
  hash.update(content)
  const hashHexStr = hash.digest('hex')
  hash.end()
  return hashHexStr.substr(0, length)
}

function ensureDirectoryExistence (filePath) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExistence(dirname)
  fs.mkdirSync(dirname)
}

module.exports = {
  getHash,
  getManifestPath,
  ensureDirectoryExistence
}
