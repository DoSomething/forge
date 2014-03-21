module.exports = {
  minify: {
    options: {
      report: "gzip"
    },
    files: {
      "dist/neue.css": ["dist/neue.css"],
      "dist/ie.css": ["dist/ie.css"]
    }
  }
}
