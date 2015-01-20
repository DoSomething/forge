/* jshint node:true */
"use strict";

var path = require('path');

module.exports = function(grunt) {
  // Measure the time each task takes
  require('time-grunt')(grunt);

  // Load tasks from `tasks/`
  grunt.loadTasks('tasks');

  // Load plugin configuration from `tasks/`.
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'tasks'),
    init: true,
    data: {
      pkg: grunt.file.readJSON("package.json")
    }
  });
};

