/* jshint node:true */
"use strict";

var path = require('path');
var sass = require('node-sass');
var fs = require('fs');

module.exports = function(grunt) {
  // Measure the time each task takes to run
  require('time-grunt')(grunt);

  /**
   * Hacky binding to Node-Sass 2.0.0 beta. Only temporary!
   */
  grunt.registerTask('nodesass', function() {
    console.log(sass.info());

    // neue.css
    // --------
    var result = sass.renderSync({
      file: __dirname + '/scss/neue-build.scss',
      outFile: __dirname + '/dist/neue.css',
      outputStyle: 'compressed',
      sourceMap: true
    });

    grunt.file.write(__dirname + '/dist/neue.css', result.css);

    // styleguide.css
    // --------
    var result2 = sass.renderSync({
      file: __dirname + '/scss/styleguide.scss',
      outFile: __dirname + '/dist/styleguide.css',
      outputStyle: 'compressed',
      sourceMap: true
    });

    grunt.file.write(__dirname + '/dist/styleguide.css', result2.css);
  });

  // Load plugin configuration from `tasks/`
  // See `aliases.yaml` for task aliases.
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'tasks'),
    init: true,
    config: {
      pkg: grunt.file.readJSON("package.json")
    }
  });
};

