/* config-overrides.js */
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack: function (config, env) {
    const vscodeRuntime = process.argv[2] === 'RUNTIME=VSCODE'
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ["javascript", "typescript"],
      })
    );
    if (env !== "production") {
      return config;
    }
    config.output.publicPath = vscodeRuntime ? "https://file+.vscode-resource.vscode-cdn.net/" : './';
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
