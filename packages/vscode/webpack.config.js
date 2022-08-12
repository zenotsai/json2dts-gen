
'use strict';

const path = require('path');
/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

  entry: './src/extension.ts', 
  output: { 
      path: path.resolve(__dirname, 'dist'),
      filename: 'extension.js',
      libraryTarget: "commonjs2",
      devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: 'source-map',
  externals: {
      vscode: "commonjs vscode" // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: { // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
      extensions: ['.ts', '.js']
  },
  module: {
      rules: [{
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [{
              loader: 'ts-loader'
          }]
      }]
  },
}

module.exports = config;

