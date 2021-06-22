# build-change-webpack-plugin

## config

```js
const DEFAULT_OPTIONS = {
  cacheTime: 86400, // one day, unit: s
  use: true, // use the plugin?
  rebuildChangeFiles: [] // when the files change, get a new build, band this plugin
}
```

## use

```js
const BuildChangeWebpackPlugin = require('build-change-webpack-plugin')
// webpack config
// ...
plugins: [
    new BuildChangeWebpackPlugin({
      cacheTime: 30,
      use: true,
      rebuildChangeFiles: ['file-path/a.json']
    })
]
// ...
```
