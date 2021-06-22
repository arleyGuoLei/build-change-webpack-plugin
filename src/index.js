const { getHash, getManifestPath, ensureDirectoryExistence } = require('./utils')
const fs = require('fs')

const DEFAULT_OPTIONS = {
  cacheTime: 86400, // one day, unit: s
  use: true, // use the plugin?
  rebuildChangeFiles: [] // when the files change, get a new build, band this plugin
}

class BuildChangeWebpackPlugin {
  constructor (options) {
    this.options = this.handleOptions(options)
  }

  handleOptions (options) {
    let { cacheTime, use, rebuildChangeFiles } = options

    if (!(typeof cacheTime === 'number' && cacheTime > 0)) {
      cacheTime = DEFAULT_OPTIONS.cacheTime
      console.warn(`BuildChangeWebpackPlugin:: cacheTime type is error, please set it is a number(>0), will use ${cacheTime}`)
    }

    if (!(typeof use === 'boolean')) {
      use = DEFAULT_OPTIONS.use
      console.warn(`BuildChangeWebpackPlugin:: use type is error, please set it is a boolean, will use ${use}`)
    }

    if (!Object.prototype.toString.call(rebuildChangeFiles) === '[object Array]') {
      rebuildChangeFiles = DEFAULT_OPTIONS.rebuildChangeFiles
      console.warn(`BuildChangeWebpackPlugin:: rebuildChangeFiles type is error, please set it is a array of string, will use ${rebuildChangeFiles}`)
    }

    return {
      cacheTime,
      use,
      rebuildChangeFiles
    }
  }

  getLocalManifest () {
    try {
      const manifest = fs.readFileSync(getManifestPath(), {
        encoding: 'utf8'
      })
      return (JSON.parse(manifest))
    } catch (error) {}
    return {}
  }

  setLocalManifest (manifest) {
    const manifestPath = getManifestPath()
    ensureDirectoryExistence(manifestPath)
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))
  }

  /**
   * whether to open the plugin
   */
  getPluginStatus (manifest) {
    if (!this.options.use) {
      return false
    }

    const expires = Date.now() + this.options.cacheTime * 1000
    let rebuild = false
    if (manifest && manifest.expires < Date.now()) {
      rebuild = true
      console.log(`BuildChangeWebpackPlugin:: expires ${manifest.expires} is timeout, band this plugin`)
    }

    const rebuildChangeFilesHash = {}
    this.options.rebuildChangeFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, {
          encoding: 'utf8'
        })
        const hash = getHash(content)
        rebuildChangeFilesHash[file] = hash

        if (manifest && manifest[file] && manifest[file] !== hash) {
          console.log(`BuildChangeWebpackPlugin:: rebuildChangeFiles ${file} is change, band this plugin`)
          rebuild = true
        }
      } catch (error) {
        console.warn(`BuildChangeWebpackPlugin:: rebuildChangeFiles error ${file}`)
      }
    })

    return Object.assign({ expires, use: this.options.use && !rebuild }, rebuildChangeFilesHash)
  }

  apply (compiler) {
    compiler.hooks.emit.tap('build-change-webpack-plugin', (compilation) => {
      const manifest = {}

      const localManifest = this.getLocalManifest()
      const usePlugin = this.getPluginStatus(localManifest)

      for (const name of Object.keys(compilation.assets)) {
        const hash = getHash(compilation.assets[name].source())
        manifest[name] = hash

        if (usePlugin.use && localManifest[name] && localManifest[name] === hash) {
          delete compilation.assets[name]
        }
      }
      this.setLocalManifest(Object.assign(localManifest, manifest, usePlugin))
    })
  }
}

module.exports = BuildChangeWebpackPlugin
