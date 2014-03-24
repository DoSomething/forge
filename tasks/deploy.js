module.exports = function(grunt) {
  grunt.registerTask("deploy", "Runs tests and lints code, compiles for production, deploys master to the dist branch, and makes a git tag.", function(ver) {
    // Bump semantic version. Default to incrementing 'patch'.
    validBumps = ["patch", "minor", "major"];
    ver = ver || "patch";

    if( validBumps.indexOf(ver) === -1 ) {
      throw grunt.util.error("Invalid bump type: choose 'deploy:patch' (default), 'deploy:minor', or 'deploy:major'.");
    }

    // 1. Bump version using grunt-bump.
    // 2. Check that we're on "dev"
    // 3. Check that the current tag is valid.
    // 4. Compile for production before testing.
    // 5. Test and lint to catch any potential errors.
    // 6. Check that the repo is clean, since we're about to do some *serious shit*.
    // 7. Go crazy (i.e. run "shell:dist" task).

    grunt.task.run("bump:" + ver, "checkbranch:dev", "checkrepo:validtag", "prod", "test:js", "lint", "checkrepo:clean", "shell:dist");
  });
}
