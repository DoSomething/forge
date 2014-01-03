/* jshint node:true */
"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    watch: {
      sass: {
        files: ["scss/**/*.{scss,sass}"],
        tasks: ["sass:dev"]
      },
      js: {
        files: ["js/vendor/**/*.js", "js/**/*.js", "js-app/**/*.js", "tests/**/*.js"],
        tasks: ["jshint:all", "uglify:dev"]
      },
      livereload: {
        files: ["*.html", "assets/**/*.{js,json}", "assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}"],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      prod: {
        files: {
          "assets/neue.css": "scss/neue.scss",
          "assets/neue.dev.css": "scss/neue.dev.scss",
          "assets/ie.css": "scss/ie.scss"
        },
        options: {
          style: "compressed"
        }
      },
      dev: {
        files: {
          "assets/neue.css": "scss/neue.scss",
          "assets/neue.dev.css": "scss/neue.dev.scss",
          "assets/ie.css": "scss/ie.scss"
        },
        options: {
          lineNumbers: true
        }
      }
    },

    cssmetrics: {
      dist: {
        src: [
          "assets/neue.css",
          "assets/neue.dev.css",
          "assets/ie.css"
        ]
      }
    },

    jshint: {
      options: {
        force: true,
        jshintrc: true,
        reporter: require("jshint-stylish")
      },
      all: ["js/**/*.js", "js-app/**/*.js", "!js/vendor/**/*.js", "tests/**/*.js", "!tests/wraith/**/*.js", "!tests/lib/**/*.js"]
    },

    qunit: {
      all: ["tests/*.html"]
    },

    uglify: {
      prod: {
        options: {
          report: "gzip"
        },
        files: {
          "assets/neue.js": ["js/vendor/*.js", "js/**/*.js", "!js/_*.js"],
          "assets/app.js": ["js-app/**/*.js", "!js-app/_*.js"]
        }
      },
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true
        },
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
    },

    shell: {
      wraith: {
        command: 'cd tests/wraith && rake && open tests/wraith/ds/gallery.html',
        options: {
          stdout: true
        }
      }
    }

  });

  // dev build tasks
  grunt.registerTask("default", ["build", "watch"]);
  grunt.registerTask("test", ["test:css", "test:js"]);
  grunt.registerTask("test:css", ["shell:wraith"]);
  grunt.registerTask("test:js", ["qunit"]);

  grunt.registerTask("build", ["sass:dev", "jshint:all", "uglify:dev"]);

  // run this before pushing code to master – minifies css/js
  grunt.registerTask("prod", ["sass:prod", "cssmetrics:dist", "jshint:all", "uglify:prod", "qunit", "docco"]);


  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-css-metrics');
  grunt.loadNpmTasks("grunt-docco2");
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks('grunt-shell');
};
