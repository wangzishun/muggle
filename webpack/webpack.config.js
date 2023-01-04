const webpack = require('webpack')
const path = require('path')

const config = {
  entry: {
    commonjs: './src/commonjs/index.js',
    esmodule: './src/esmodule/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
  devtool: false,
}

module.exports = config
