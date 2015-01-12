module.exports = {
  sass: {
    files: ["scss/**/*.{scss,sass}", "!scss/**/*scsslint_tmp*.scss"],
    tasks: ["scsslint:all", "sass:compile", "postcss:process"]
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
