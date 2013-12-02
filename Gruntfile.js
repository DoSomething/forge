/* jshint node:true */
"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    watch: {
      sass: {
        files: ["scss/**/*.{scss,sass}"],
        tasks: ["sass:dist"]
      },
      js: {
        files: ["js/vendor/**/*.js", "js/**/*.js", "js-app/**/*.js"],
        tasks: ["jshint:all", "uglify:js", "docco"]
      },
      livereload: {
        files: ["*.html", "assets/**/*.{js,json}", "assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}"],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      dist: {
        files: {
          "assets/neue.css": "scss/neue.scss",
          "assets/neue.dev.css": "scss/neue.dev.scss",
          "assets/ie.css": "scss/ie.scss"
        },
        options: {
          style: "compressed"
        }
      }
    },

    jshint: {
      options: {
        force: true,
        jshintrc: true,
        reporter: require("jshint-stylish")
      },
      all: ["js/**/*.js", "js-app/**/*.js", "!js/vendor/**/*.js", "test/**/*.js"]
    },

    uglify: {
      options: {
        // mangle: false,
        // compress: false,
        // beautify: true
      },
      js: {
        files: {
          "assets/neue.js": ["js/vendor/*.js", "js/**/*.js", "!js/_*.js"],
          "assets/app.js": ["js-app/**/*.js", "!js-app/_*.js"]
        }
      }
    },

    docco: {
      docs: {
        src: ["js/*.js"],
        options: {
          output: "assets/docs"
        }
      }
    },

    bump: {
      options: {
        pushTo: "origin"
      }
    }
  });

  grunt.registerTask("build", ["sass:dist", "jshint:all", "uglify:js", "docco"]);
  grunt.registerTask("default", ["build", "watch"]);

  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-docco2");
  grunt.loadNpmTasks("grunt-bump");
};
