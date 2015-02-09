module.exports = {
  all: {
    src: ["dist/neue.css", "dist/styleguide.css"],
    options: {
      map: false,
      processors: [
        require('autoprefixer-core')({
          browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1', 'Android >= 4']
        }).postcss,
        require('css-mqpacker').postcss
      ]
    }
  }
};
