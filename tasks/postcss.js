module.exports = {
  process: {
    src: "dist/neue.css",
    options: {
      map: true,
      processors: [
        require('autoprefixer-core')().postcss,
        require('css-mqpacker').postcss
      ]
    }
  }
}
