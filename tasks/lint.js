module.exports = function(grunt) {
  grunt.registerTask("lint", ["lint:js", "lint:css"]);

  grunt.registerTask("lint:js", ["jshint:all"]);
  grunt.registerTask("lint:css", ["scsslint:scss"]);
}
