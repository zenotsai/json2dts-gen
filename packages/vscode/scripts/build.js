const webpack = require('webpack');
const getWebpackConfig = require('./config');
const config = getWebpackConfig(false);
const compiler = webpack(config);

compiler.run(() => {
  console.log('Compiled successfully');

})