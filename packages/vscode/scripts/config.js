
'use strict';
const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
module.exports = function (isDevelopment) {
/**@type {import('webpack').Configuration}*/
const config = {
    target: 'node', 
    mode: isDevelopment ? 'development': 'production',
    entry: resolveApp('/src/extension.ts'), 
    output: { 
        path: resolveApp('dist'),
        filename: 'extension.js',
        libraryTarget: "commonjs2",
    },
    cache: {
        type: "filesystem",
        name: 'json2dts',
        cacheDirectory: resolveApp('node_modules/.cache'),
        store: "pack",
        buildDependencies: {
          defaultWebpack: ["webpack/lib/"],
          config: [__filename],
          tsconfig: [resolveApp('tsconfig.json')].filter((f) => fs.existsSync(f)),
        },
      },
    devtool: isDevelopment ? "cheap-module-source-map" : false,
    externals: {
        vscode: "commonjs vscode"
    },
    resolve: {
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
  return config;
}





