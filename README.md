# build-change-webpack-plugin

## 插件初衷

如果你存在如下背景，这个插件将能为你提高些许开发效率：

场景(背景)：项目开发过程中，每次打包完成后，需要将产物上传到服务器查看效果。每次打包都是全量生成产物，所以都是再全量上传。

该插件为的是节约全量上传这个过程的时间，插件实现生成打包产物的时候，只生成有变更的代码，从而实现增量上传。

原理为：通过对打包的产物获取hash值，记录在`node_module/.cache/build-change-webpack-plugin-manifest.json`中，再次打包的时候，通过对比hash值，只生成hash值有变化的代码。

## config

### cacheTime

hash值有效时间，单位秒。默认值为：86400，等于一天。

### rebuildChangeFiles

传入字符串数组，每个字符串应为一个文件**绝对**路径，文件不一定为产物代码，可以为某些配置。当数组中任意一项文件hash值有变化，将全量输出打包产物，禁用插件。

比如上传服务器的配置文件有变化，则不使用插件，则可以通过该数组配置传入配置文件的绝对路径。

### use

是否开启插件，可以通过设置false关闭插件。

## 使用举例

```js
const BuildChangeWebpackPlugin = require('build-change-webpack-plugin')
// webpack config
// ...
plugins: [
    new BuildChangeWebpackPlugin({
      cacheTime: 2 * 60 * 60, // 2 hours
      use: true,
      rebuildChangeFiles: [path.resolve(__dirname, './.env')]
    })
]
// ...
```
