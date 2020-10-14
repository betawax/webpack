#!/usr/bin/env node

const dotenv = require('dotenv').config()
const fs = require('fs-extra')
const glob = require('glob')

const manifest_file = process.env.WEBPACK_MANIFEST
const public_dir = process.env.WEBPACK_PUBLIC_DIR

// Check if the asset manifest exists
if ( ! fs.existsSync(manifest_file)) {
  console.log('Manifest not found.')
  process.exit()
}

// Import the asset manifest
const manifest = require('./'+manifest_file)

// Recursively find all HTML files
glob(public_dir+'/**/*.html', (error, files) => {

  // Hash asset filenames in each HTML file
  files.forEach((file) => hashAssetFilenames(file))

})

const hashAssetFilenames = (file) => {

  // Get the markup from the HTML file
  fs.readFile(file, 'utf8', (error, markup) => {

    // Iterate over the asset manifest
    Object.keys(manifest).forEach((non_hashed) => {

      // Get the current hashed filename
      let hashed = manifest[non_hashed]

      // Replace the non-hashed with the hashed filename
      markup = markup.replace(new RegExp(non_hashed, 'g'), hashed)

    })

    // Save the updated markup
    fs.writeFile(file, markup)

  })

}
