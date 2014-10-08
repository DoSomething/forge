module.exports = {
  compile: {
    files: {
      "dist/neue.css": "scss/neue-build.scss",
      "dist/styleguide.css": "scss/styleguide.scss",
    },
    options: {
      outputStyle: "compressed",
      sourceComments: "map"
    }
  }
}
