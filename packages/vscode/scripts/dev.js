const webpack = require('webpack');
const getWebpackConfig = require('./config');
const config = getWebpackConfig(true);
const compiler = webpack(config);

compiler.watch({
  ignored: /node_modules/,
}, (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Compiled successfully');

})