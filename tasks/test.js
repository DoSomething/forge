module.exports = function(grunt) {
  grunt.registerTask("test", ["test:css", "test:js"]);

  grunt.registerTask("test:css", ["shell:wraith"]);
  grunt.registerTask("test:js", ["qunit"]);
}
