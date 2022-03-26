/* config-overrides.js */
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack: function (config, env) {
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ["javascript", "typescript"],
      })
    );
    if (env !== "production") {
      return config;
    }
    config.output.publicPath = "./";
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.devMiddleware.writeToDisk = true;
      return config;
    };
  },
};
