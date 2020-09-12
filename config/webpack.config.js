const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const buildPath = path.join(__dirname, "..", "build");
const staticPath = path.join(__dirname, "..", "static");
const srcPath = path.join(__dirname, "..", "src");

module.exports = {
  entry: {
    "content-script": path.join(srcPath, "content-script.ts"),
    background: path.join(srcPath, "background.ts"),
  },
  output: {
    filename: "[name].js",
    path: buildPath,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".mjs", ".tsx", ".ts", ".js"],
    alias: {
      // Keep up to date with tsconfig.json
      "@src": path.resolve(srcPath),
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: staticPath, to: buildPath }],
    }),
  ],
};
