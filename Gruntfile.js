/* jshint node:true */
"use strict";

module.exports = function(grunt) {
  // Load tasks & measure timing
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Configure Grunt tasks
  grunt.initConfig({
    /**
     * Clean the `dist/` folder between builds.
     */
    clean: {
      'dist': ['dist/']
    },

    /**
     * Bump version numbers in `package.json` and `bower.json`,
     * and make a version commit marker. Used by CI script.
     */
    bump: {
      options: {
        files: ["package.json", "bower.json"],
        commitFiles: ["package.json", "bower.json"],
        push: false,
        createTag: false
      }
    },

    /**
     * Copy assets into `dist/` directory.
     */
    copy: {
      assets: {
        files: [
          {expand: true, src: ["assets/**"], dest: "dist/"}
        ]
      }
    },

    /**
     * Run Express pattern library server in background while
     * Grunt task is active.
     */
    express: {
      dev: {
        options: {
          script: 'styleguide/bin/start.js'
        }
      }
    },

    /**
     * Build JavaScript with RequireJS.
     */
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

      // On production builds, we should minify and drop
      // dead code, `debugger`, and `console.log` statements.
      prod: {
        options: {
          preserveLicenseComments: false,
          generateSourceMaps: false,
          optimize: "uglify2",
          uglify2: {
            compress: {
              dead_code: true,
              drop_debugger: true,
              drop_console: true,
              global_defs: {
                DEBUG: false
              }
            }
          }
        }
      },

      // On development builds, include source maps & do not minify.
      debug: {
        options: {
          generateSourceMaps: true,
          optimize: "none"
        }
      }
    },

    /**
     * Pre-process CSS with LibSass.
     */
    sass: {
      // On production builds, minify and remove comments.
      prod: {
        files: {
          'dist/neue.css': 'scss/neue-build.scss',
          'dist/styleguide.css': 'scss/styleguide.scss'
        },
        options: {
          outputStyle: 'compressed'
        }
      },

      // On development builds, include source maps & do not minify.
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

    /**
     * Post-process CSS with PostCSS.
     *
     * We use Autoprefixer to automatically add vendor-prefixes for appropriate
     * browsers. We use CSS-MQPacker to concatenate all media queries at the
     * end of our built stylesheets.
     */
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({
            browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1']
          }).postcss,
          require('css-mqpacker').postcss
        ]
      },

      // On production builds, omit source maps.
      prod: {
        src: ['dist/neue.css', 'dist/styleguide.css'],
        options: {
          map: false
        }
      },

      // On development builds, include source maps.
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
          // We prefix all Modernizr classes with `modernizr-` to avoid class conflicts.
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

    /**
     * Lint JavaScript using JSHint.
     */
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

    /**
     * Watch files for changes, and trigger relevant tasks.
     */
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

  /**
   * Register Grunt aliases.
   */

  // > grunt
  // Build for development & watch for changes.
  grunt.registerTask('default', ['build:debug', 'express:dev', 'test', 'watch']);

  // > grunt build
  // Build for production.
  grunt.registerTask('build', ['clean:dist', 'copy:assets', 'sass:prod', 'postcss:prod', 'requirejs:prod', 'modernizr:all']);

  // > grunt build:debug
  // Build for development.
  grunt.registerTask('build:debug', ['clean:dist', 'copy:assets', 'sass:debug', 'postcss:debug', 'requirejs:debug', 'modernizr:all']);

  // > grunt test
  // Run included unit tests and linters.
  grunt.registerTask('test', ['jshint']);

};

