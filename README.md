# Webpack

A simple to use yet full-featured asset pipeline based on Webpack.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [General Usage](#general-usage)
4. [Coding Guidelines](#coding-guidelines)

## Project Overview

### Base Technologies

Webpack ✔︎ Node ✔︎ Sass ✔︎ Babel ✔︎ Autoprefixer ✔︎ Browserslist ✔︎ Dotenv ✔︎

### System Requirements

You will need to have Git and NPM installed on your local system. Node 14 and up is supported.

## Getting Started

### Set up the application

Execute the following commands to set up a local development environment.

#### 1. Clone the project repository

```
git clone git@github.com:betawax/webpack.git
```

#### 2. Configure the local environment

```
cp .env.example .env
```

#### 3. Install dependencies

```
npm install
```

#### 4. Build assets

```
npm run dev
```

### Serve the application

There are two ways to serve the application during local development.

#### Watch

Watch files and build assets on the fly:

```
npm run watch
```

Serve the application using PHP's [built-in web server](https://www.php.net/manual/en/features.commandline.webserver.php):

```
php -S localhost:8000 -t public
```

#### Serve

Serve the application using Webpack's [DevServer](https://webpack.js.org/configuration/dev-server/) with live reloading:

```
npm run serve
```

## General Usage

The project comes with a pre-configured asset pipeline that takes care of the complete build process.

### Available commands

Take a look at the following table to see all available `npm` commands and what they are doing:

| `npm run`       | `watch` | `serve` | `dev` | `prod` |
| --------------- | :-----: | :-----: | :---: | :----: |
| Watch Files     | ✔︎ | ✔︎ | 𝗫 | 𝗫 |
| Live Reloading  | 𝗫 | ✔︎ | 𝗫 | 𝗫 |
| Resolve Imports | ✔︎ | ✔︎ | ✔︎ | ✔︎ |
| Code Splitting  | ✔︎ | ✔︎ | ✔︎ | ✔︎ |
| Compile Scripts | ✔︎ | ✔︎ | ✔︎ | ✔︎ |
| Compile Sass    | ✔︎ | ✔︎ | ✔︎ | ✔︎ |
| Auto Prefix     | ✔︎ | ✔︎ | ✔︎ | ✔︎ |
| Source Maps     | ✔︎ | ✔︎ | ✔︎ | 𝗫 |
| Optimize Output | 𝗫 | 𝗫 | 𝗫 | ✔︎ |
| Hash Filenames  | 𝗫 | 𝗫 | 𝗫 | ✔︎ |
| Asset Manifest  | 𝗫 | 𝗫 | 𝗫 | ✔︎ |

### Supported resources

The following resource types are supported and will be handled appropriately:

- **Scripts** will be compiled into browser compatible code
- **Styles** will be compiled into CSS and vendor prefixes will be applied
- **Images & Fonts** will be emitted and their paths will be resolved
- **SVGs** will be placed inline as UTF-8 encoded strings
- **Static** assets will be distributed recursively

## License

Licensed under the MIT license.
