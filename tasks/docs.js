module.exports = function(grunt) {
  // The `doc` task builds documentation from inline code comments.
  grunt.registerTask("doc", ["doc:js"]);

  grunt.registerTask("doc:js", ["docco"]);
}
