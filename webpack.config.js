const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname) + "/dev/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, "dev/chat.html"), to: "" }],
      patterns: [{ from: path.resolve(__dirname, "dev/style.css"), to: "" }],
      options: {
        concurrency: 100,
      },
    }),
  ],
};
