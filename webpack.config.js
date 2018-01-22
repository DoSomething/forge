const configure = require('@dosomething/webpack-config');
const path = require('path');

module.exports = configure({
  entry: {
    forge: './index.js',
    styleguide: './styleguide/styleguide.js'
  },

  output: {
    path: path.join(__dirname, 'dist'),
  },

  // Don't bundle the 'jquery' package with the library (forge.js), but
  // instead load from `jQuery` global variable or AMD/CJS package.
  externals: {
    'jquery': {
      root: 'jQuery',
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery'
    }
  },
});
