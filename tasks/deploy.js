module.exports = function(grunt) {
  grunt.registerTask("deploy", "Runs tests and lints code, compiles for production, deploys master to the dist branch, and makes a git tag.", function() {
    // 1. Check that we're on "dev"
    // 2. Check that the current tag is valid.
    // 3. Compile for production before testing.
    // 4. Test and lint to catch any potential errors.
    // 5. Check that the repo is clean, since we're about to do some *serious shit*.
    // 6. Go crazy (i.e. run "shell:dist" task).

    grunt.task.run("checkbranch:dev", "checkrepo:validtag", "prod", "test:js", "lint", "checkrepo:clean", "shell:dist");
  });
}
