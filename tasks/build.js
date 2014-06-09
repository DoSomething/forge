module.exports = function(grunt) {
  // The `build` task compiles assets for local development (unminified, with debugging comments).
  grunt.registerTask("build", ["clean:dist", "copy:main", "sass:compile", "requirejs:compile"]);

  // The `prod` build task is used when building for production. Since compiled assets
  // are ignored in version control, this is run in Continuous Integration on deploy.
  grunt.registerTask("prod", ["clean:dist", "copy:main", "sass:compile", "requirejs:compile"]);

}
