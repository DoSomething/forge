var fs = require('fs');
var path = require('path');
var sass = require('node-sass');

module.exports = function(grunt) {
  grunt.registerTask('sass', function() {
    var done = this.async();
    grunt.log.writeln(sass.info());

    var inFile = path.resolve('scss/neue-build.scss');
    var outFile = path.resolve('dist/neue.css');

    sass.render({
      file: inFile,
      outFile: outFile,
      outputStyle: 'compressed',
      sourceMap: false,
      success: function(result) {
        if(grunt.file.exists(outFile)) {
          grunt.file.delete(outFile);
        }

        grunt.file.write(outFile, result.css);
        grunt.log.ok('Wrote "' + outFile + '".')

        done();
      },
      error: function(error) {
        grunt.log.error('Error: ' + error.message);
        grunt.log.error('File: ' + error.file);
        grunt.log.error('Line: ' + error.line);
        done();
      }
    });

  });
};

