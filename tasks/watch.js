module.exports = {
  sass: {
    files: ["scss/**/*.{scss,sass}"],
    tasks: ["sass", "scsslint",  "postcss"]
  },
  js: {
    files: ["js/**/*.js", "tests/**/*.js"],
    tasks: ["requirejs", "jshint", "qunit"]
  },
  assets: {
    files: ["assets/**/*"],
    tasks: ["copy:assets"]
  }
};
