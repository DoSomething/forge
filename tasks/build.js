module.exports = function(grunt) {
  // The `build` task compiles assets for local development (unminified, with debugging comments).
  grunt.registerTask("build", ["lint", "sass:compile", "uglify:dev", "copy:main"]);

  // The `prod` build task is used when building for production. Since compiled assets
  // are ignored in version control, this is run in Continuous Integration on deploy.
  grunt.registerTask("prod", ["shell:clean", "sass:compile", "cssmin:minify", "copy:main", "uglify:dev", "uglify:prod"]);
}
