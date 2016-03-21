var config = require('@dosomething/webpack-config');

module.exports = config({
  entry: {
    forge: './index.js',
    styleguide: './styleguide/styleguide.js'
  },
});
