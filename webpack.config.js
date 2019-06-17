const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const configure = require('@dosomething/webpack-config');
const path = require('path');

module.exports = configure({
  entry: {
    forge: './index.js',
    styleguide: './styleguide/styleguide.js',
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'forge',
  },

  // Don't bundle the 'jquery' package with the library (forge.js), but
  // instead load from `jQuery` global variable or AMD/CJS package.
  externals: {
    jquery: {
      root: 'jQuery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
    },
  },

  // Reset extracted CSS name (so we don't include a content hash):
  plugins: [new MiniCssExtractPlugin({ filename: '[name].css' })],
});
