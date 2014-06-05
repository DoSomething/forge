module.exports = {
  options: {
    jshintrc: true,
    reporter: require("jshint-stylish")
  },
  all: [
    "js/**/*.js",
    "!js/vendor/**/*.js",
    "tests/**/*.js",
    "!tests/lib/**/*.js"
  ]
}
