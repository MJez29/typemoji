const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const ReloadChromeExtensionPlugin = require("./reload-chrome-extension-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./build",
  },
  plugins: [
    new ReloadChromeExtensionPlugin({
      extensionName: "Typemoji",
    }),
  ],
});
