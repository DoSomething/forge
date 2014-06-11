/* jshint node:true */
"use strict";

var path = require('path');

module.exports = function(grunt) {
  // Measure the time each task takes to run
  require('time-grunt')(grunt);

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

