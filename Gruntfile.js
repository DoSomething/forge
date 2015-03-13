/* jshint node:true */
"use strict";

module.exports = function(grunt) {
  // Load tasks & measure timing
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Load tasks from `tasks/`
  grunt.initConfig({
    clean: {
      'dist': ['dist/']
    },
    bump: {
      options: {
        files: ["package.json", "bower.json"],
        commitFiles: ["package.json", "bower.json"],
        push: false,
        createTag: false
      }
    },
    copy: {
      assets: {
        files: [
          {expand: true, src: ["assets/**"], dest: "dist/"}
        ]
      }
    },
    express: {
      dev: {
        options: {
          script: 'styleguide/bin/start.js'
        }
      }
    },
    requirejs: {
      options: {
        baseUrl: "dist/",
        name: "../bower_components/almond/almond",
        paths: {
          "neue": "../js"
        },
        include: "neue/main",
        insertRequire: ["neue/main"],
        out: "dist/neue.js",
        wrap: true,
        preserveLicenseComments: false,
      },
      prod: {
        options: {
          generateSourceMaps: false,
          optimize: "uglify2"
        }
      },
      debug: {
        options: {
          generateSourceMaps: true,
          optimize: "none"
        }
      }
    },
    sass: {
      prod: {
        files: {
          'dist/neue.css': 'scss/neue-build.scss',
          'dist/styleguide.css': 'scss/styleguide.scss'
        },
        options: {
          outputStyle: 'compressed'
        }
      },
      debug: {
        files: {
          'dist/neue.css': 'scss/neue-build.scss',
          'dist/styleguide.css': 'scss/styleguide.scss'
        },
        options: {
          sourceMap: true
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({
            browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1']
          }).postcss,
          require('css-mqpacker').postcss
        ]
      },
      prod: {
        src: ['dist/neue.css', 'dist/styleguide.css'],
        options: {
          map: false
        }
      },
      debug: {
        src: ['dist/neue.css', 'dist/styleguide.css']
      }
    },
    modernizr: {
      all: {
        "devFile": "remote",
        "outputFile": "dist/modernizr.js",
        "files" : {
          "src": [
            "js/**/*.js",
            "!js/modernizr/**/*.js",
            "scss/**/*.scss"
          ]
        },
        extensibility : {
          "cssclassprefix": "modernizr-"
        },
        "extra" : {
          "shiv" : false,
          "teststyles": true,
          "printshiv" : false,
          "load" : true,
          "mq" : false,
          "video": false
        },
        "customTests": [
          "js/modernizr/checked.js",
          "js/modernizr/label-click.js"
        ]
      }
    },
    jshint: {
      options: {
        force: true,
        jshintrc: true,
        reporter: require("jshint-stylish")
      },
      all: [
        "js/**/*.js",
        "tests/**/*.js",
        "!tests/lib/**/*.js"
      ]
    },
    watch: {
      sass: {
        files: ["scss/**/*.scss"],
        tasks: ["sass", "postcss"]
      },
      js: {
        files: ["js/**/*.js"],
        tasks: ["requirejs:debug", "jshint"]
      },
      assets: {
        files: ["assets/**/*"],
        tasks: ["copy:assets"]
      }
    }
  });

  // Aliases
  grunt.registerTask('default', ['build:debug', 'express:dev', 'test', 'watch']);
  grunt.registerTask('build', ['clean:dist', 'copy:assets', 'sass:prod', 'postcss:prod', 'requirejs:prod', 'modernizr:all']);
  grunt.registerTask('build:debug', ['clean:dist', 'copy:assets', 'sass:debug', 'postcss:debug', 'requirejs:debug', 'modernizr:all']);
  grunt.registerTask('test', ['jshint']);
};

