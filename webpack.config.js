const dotenv = require('dotenv').config()
const Dotenv = require('dotenv-webpack')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
const fs = require('fs-extra')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
      './resources/scripts/application.js',
      './resources/styles/application.scss'
    ],
    'vendor': [
      './resources/styles/vendor.scss'
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
          test: /[\\/]node_modules[\\/]/
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
    new CleanWebpackPlugin(),

    // Remove style only entry scripts
    new FixStyleOnlyEntriesPlugin({ silent: true })

  ],

  //
  // Modules
  //

  module: {
    rules: [

      //
      // Scripts
      //

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      //
      // Styles
      //

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env']
              }
            }
          },
          'sass-loader'
        ]
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
    // DevServer
    //

    devServer: {

      // The absolute path where to serve content from
      contentBase: path.join(__dirname, 'public')

    },

    //
    // Output
    //

    output: {
      filename: 'scripts/[name].min.js',
      chunkFilename: 'scripts/[name].min.js'
    },

    //
    // Plugins
    //

    plugins: [

      // Extract styles into separate files
      new MiniCssExtractPlugin({
        filename: 'styles/[name].min.css',
        chunkFilename: 'styles/[name].min.css'
      })

    ],

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

      // Extract styles into separate files
      new MiniCssExtractPlugin({
        filename: 'styles/[name]-[contenthash:7].min.css',
        chunkFilename: 'styles/[name]-[chunkhash:7].min.css'
      }),

      // Generate a asset manifest
      new ManifestPlugin({

        // Only add certain file types to the manifest
        filter: (file) => file.path.match(/\.js$|\.css$/),

        // Modify file paths before the manifest is created
        map: (file) => modifyManifestFilePath(file)

      }),

      {
        apply: (compiler) => {

          // Create symbolic links for hashed assets
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => symlinkHashedAssets())

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

const symlinkHashedAssets = () => {

  // Get the asset manifest
  const manifest = require('./'+process.env.WEBPACK_MANIFEST)

  // Change into the public directory
  process.chdir('./public')

  // Create symbolic links
  for (let symlink in manifest) {
    let origin = manifest[symlink]
    fs.ensureSymlinkSync(origin, symlink)
  }

}
