module.exports = {
  sass: {
    files: ["scss/**/*.scss"],
    tasks: ["sass", "scsslint",  "postcss"]
  },
  js: {
    files: ["js/**/*.js"],
    tasks: ["requirejs", "jshint"]
  },
  assets: {
    files: ["assets/**/*"],
    tasks: ["copy:assets"]
  }
};
