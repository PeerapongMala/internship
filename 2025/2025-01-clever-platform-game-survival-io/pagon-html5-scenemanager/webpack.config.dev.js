const path = require("path");
const jsPackage = require("./package.json");

module.exports = {
  entry: ["./src/scenemanager.js", "./src/scenetemplate.js"],
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./build/"),
    filename: jsPackage.name + "." + jsPackage.version + ".dev.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          },
          {
            loader: "eslint-loader",
            options: {
              // eslint options (if necessary)
            }
          }
        ]
      }
    ]
  }
};
