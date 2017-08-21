const configure = require('@dosomething/webpack-config');

module.exports = configure({
  entry: {
    core: './src/core.js',
    client: './src/client.js',
    admin: './src/admin.js',
  },

  output: {
    path: __dirname + '/dist',
  }
});
