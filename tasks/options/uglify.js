module.exports = {
  prod: {
    options: {
      report: "gzip"
    },
    files: {
      "dist/neue.min.js": ["js/vendor/**/*.js", "js/**/*.js"]
    }
  },
  dev: {
    options: {
      mangle: false,
      compress: false,
      beautify: true
    },
    files: {
      "dist/neue.js": ["js/vendor/**/*.js", "js/**/*.js"]
    }
  }
}
