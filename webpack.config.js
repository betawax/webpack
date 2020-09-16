const dotenv = require('dotenv').config()
const Dotenv = require('dotenv-webpack')
const fs = require('fs-extra')
const ManifestPlugin = require('webpack-manifest-plugin')
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

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'all',
          enforce: true,
          test: /[\\/]node_modules[\\/]|[\\/]vendor[\\/]/
        }
      }
    }
  },

  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },

  stats: {
    children: false,
    entrypoints: false
  }

}

//
// Development
//

if (process.env.NODE_ENV === 'development') {
  module.exports = merge(module.exports, {

    mode: 'development',

    performance: {
      hints: false
    },

    devtool: 'source-map',

    devServer: {
      contentBase: './public'
    },

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
    },

    plugins: [

      new ManifestPlugin({
        filter: (file) => file.path.match(/\.js$|\.css$/),
        map: (file) => {
          const extension = path.extname(file.name).slice(1)
          file.name = extension === 'js' ? 'dist/scripts/'+file.name.replace('.js', '.min.js') : file.name
          file.name = extension === 'css' ? 'dist/styles/'+file.name.replace('.css', '.min.css') : file.name
          return file
        }
      }),

      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            const manifest = require('./'+process.env.WEBPACK_MANIFEST)
            process.chdir('./public')
            for (let symlink in manifest) {
              let origin = manifest[symlink]
              fs.ensureSymlinkSync(origin, symlink)
            }
          })
        }
      }

    ]

  })
}
