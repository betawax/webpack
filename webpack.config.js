const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')

//
// Webpack
//

module.exports = {

  entry: {
    'application': [
      './resources/scripts/application.js'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist/'
  },

  plugins: [
    new CleanWebpackPlugin()
  ]

}

//
// Development
//

if (process.env.NODE_ENV === 'development') {
  module.exports = merge(module.exports, {

    mode: 'development',

    output: {
      filename: 'scripts/[name].min.js',
      chunkFilename: 'scripts/[name].min.js'
    }

  })
}

//
// Production
//

if (process.env.NODE_ENV === 'production') {
  module.exports = merge(module.exports, {

    mode: 'production',

    output: {
      filename: 'scripts/[name]-[contenthash:7].min.js',
      chunkFilename: 'scripts/[name]-[chunkhash:7].min.js'
    }

  })
}
