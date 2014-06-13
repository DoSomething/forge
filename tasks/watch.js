module.exports = {
  sass: {
    files: ["scss/**/*.{scss,sass}"],
    tasks: ["scsslint:all", "sass:compile"]
  },
  js: {
    files: ["js/**/*.js", "tests/**/*.js"],
    tasks: ["jshint:all", "requirejs:compile", "test:js"]
  },
  images: {
    files: ["assets/**/*"],
    tasks: ["copy:assets"]
  }
}
