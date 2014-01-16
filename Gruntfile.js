/* jshint node:true */
"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    watch: {
      sass: {
        files: ["scss/**/*.{scss,sass}"],
        tasks: ["sass:compile"]
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
      compile: {
        files: {
          "tmp/neue.css": "scss/neue.scss",
          "assets/neue.dev.css": "scss/neue.dev.scss",
          "assets/ie.css": "scss/ie.scss"
        },
        options: {
          sourceComments: "normal"
        }
      }
    },

    cssmin: {
      minify: {
        options: {
          report: 'gzip'
        },
        files: {
          "assets/neue.css": ["tmp/neue.css"],
          "assets/neue.dev.css": ["assets/neue.dev.css"],
          "assets/ie.css": ["assets/ie.css"]
        }
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
      },
      scsslint: {
        command: 'scss-lint scss/ --config .scss-lint.yaml',
        options: {
          stdout: true
        }
      }
    }

  });


  grunt.registerTask("default", ["build", "watch"]);

  // code linting
  grunt.registerTask("lint", ["jshint:all", "shell:scsslint"]);

  // testing
  grunt.registerTask("test", ["test:css", "test:js"]);
  grunt.registerTask("test:css", ["shell:wraith"]);
  grunt.registerTask("test:js", ["qunit"]);

  // build
  grunt.registerTask("build", ["lint", "sass:compile", "uglify:dev"]);
  grunt.registerTask("prod", ["lint", "sass:compile", "cssmin:minify", "uglify:prod", "qunit", "docco"]); // run before pushing code to master – minifies css/js


  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-docco2");
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks('grunt-shell');
};
