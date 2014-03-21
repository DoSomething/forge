module.exports = {
  options: {
    force: true,
    jshintrc: true,
    reporter: require("jshint-stylish")
  },
  all: [
    "js/**/*.js",
    "!js/vendor/**/*.js",
    "!js/polyfills/**/*.js",
    "tests/**/*.js",
    "!tests/wraith/**/*.js",
    "!tests/lib/**/*.js"
  ]
}
