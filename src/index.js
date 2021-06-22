class BuildChangeWebpackPlugin {
  constructor (options) {

  }

  // Compiler 对象包含了当前运行Webpack的配置，包括entry、output、loaders等配置
  // 这个对象在启动Webpack时被实例化，而且是全局唯一的。
  // Plugin可以通过该对象获取到Webpack的配置信息进行处理。
  apply (compiler) {
    // Compilation对象可以理解编译对象，包含了模块、依赖、文件等信息。
    // 在开发模式下运行Webpack时，每修改一次文件都会产生一个新的Compilation对象，Plugin可以访问到本次编译过程中的模块、依赖、文件内容等信息。
    compiler.hooks.emit.tap('build-change-webpack-plugin', (compilation) => {
      // console.log(compilation.chunks);
      console.log('########### => ', Object.keys(compilation.assets))
    })
  }
}

module.exports = BuildChangeWebpackPlugin
