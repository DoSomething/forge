var fs = require('fs');
var path = require('path');
var sass = require('node-sass');
var eachAsync = require('each-async');

module.exports = function(grunt) {
  grunt.registerTask('sass', function() {
    grunt.log.writeln(sass.info());

    var inFile = path.resolve('scss/neue-build.scss');
    var outFile = path.resolve('dist/neue.css');

    var files = [
      {
        src: 'scss/neue-build.scss',
        dest: 'dist/neue.css'
      },
      {
        src: 'scss/styleguide.scss',
        dest: 'dist/styleguide.css'
      }
    ];

    eachAsync(files, function(file, index, done) {
      sass.render({
        file: file.src,
        outFile: file.dest,
        outputStyle: 'compressed',
        sourceMap: false,
        success: function(result) {
          if(grunt.file.exists(file.dest)) {
            grunt.file.delete(file.dest);
          }

          grunt.file.write(file.dest, result.css);
          grunt.log.ok('Wrote "' + file.dest + '".')

          done();
        },
        error: function(error) {
          grunt.log.error('Error: ' + error.message);
          grunt.log.error('File: ' + error.file);
          grunt.log.error('Line: ' + error.line);
          done();
        }
      });
    }.bind(this), this.async());

  });
};

