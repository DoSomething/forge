var webpack = require('webpack');

var config = {
  entry: './js/index.js',
  output: {
    filename: 'dist/forge.js',
    library: 'Forge',
    libraryTarget: 'umd'
  },
  externals: {
    // Don't bundle the 'jquery' package in forge.js, but
    // instead load from `jQuery` global variable or AMD/CJS package.
    'jquery': {
      root: 'jQuery',
      commonjs2: 'jquery',
      amd: 'jquery'
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': process.env.NODE_ENV
      }
    }),
    // ...
  ]
};

if(process.env.NODE_ENV === 'production') {
  // In production, minify our output with UglifyJS
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        dead_code: true
      }
    })
  )
} else {
  // Enable inline source maps when in development
  config.devtool = '#inline-source-map';
}

module.exports = config;
