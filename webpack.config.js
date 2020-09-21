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

  //
  // Entry Points
  //

  entry: {
    'application': [
      './resources/scripts/application.js'
    ]
  },

  //
  // Output
  //

  output: {

    // The absolute path of the output directory
    path: path.resolve(__dirname, 'public/dist'),

    // The public URL of the output directory
    publicPath: 'dist/'

  },

  //
  // Optimization
  //

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

  //
  // Plugins
  //

  plugins: [

    // Support environment variables
    new Dotenv(),

    // Clean the output directory
    new CleanWebpackPlugin()

  ],

  //
  // Modules
  //

  module: {
    rules: [

      //
      // Babel
      //

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }

    ]
  },

  //
  // Stats
  //

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

    // The optimization mode
    mode: 'development',

    // Generate source maps
    devtool: 'source-map',

    //
    // Output
    //

    output: {
      filename: 'scripts/[name].min.js',
      chunkFilename: 'scripts/[name].min.js'
    },

    //
    // DevServer
    //

    devServer: {

      // The absolute path where to serve content from
      contentBase: path.join(__dirname, 'public')

    },

    //
    // Performance
    //

    performance: {
      hints: false
    }

  })
}

//
// Production
//

if (process.env.NODE_ENV === 'production') {
  module.exports = merge(module.exports, {

    // The optimization mode
    mode: 'production',

    //
    // Output
    //

    output: {
      filename: 'scripts/[name]-[contenthash:7].min.js',
      chunkFilename: 'scripts/[name]-[chunkhash:7].min.js'
    },

    //
    // Plugins
    //

    plugins: [

      // Generate a asset manifest
      new ManifestPlugin({

        // Only add certain file types to the manifest
        filter: (file) => file.path.match(/\.js$|\.css$/),

        // Modify file paths before the manifest is created
        map: (file) => modifyManifestFilePath(file)

      }),

      {
        apply: (compiler) => {

          // Create symlinks for hashed production assets
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

//
// Helpers
//

const modifyManifestFilePath = (file) => {

  // Get the raw file extension without the dot
  const extension = path.extname(file.name).slice(1)

  // Modify certain file types
  file.name = ((extension) => ({
    'js': 'dist/scripts/'+file.name.replace('.js', '.min.js'),
    'css': 'dist/styles/'+file.name.replace('.css', '.min.css')
  }))()[extension] || file.name

  return file

}

const symlinkHashedAssets = () => {}
