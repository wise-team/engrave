const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: "./public/js/main.js",
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader" },
      { test: /\.vue$/, use: "vue-loader" },
      { test: /\.pug$/, loader: "pug-plain-loader" },
      { test: /\.css$/, use: ["vue-style-loader", "css-loader"] }
    ]
  },
  output: {
    path: __dirname + "/public/dist/",
    filename: "bundle.js"
  },
  plugins: [new VueLoaderPlugin()]
};
