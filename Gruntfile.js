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
        files: ["js/**/*.js", "tests/**/*.js"],
        tasks: ["jshint:all", "uglify:dev"]
      },
      images: {
        files: ["assets/images/**/*.{png,jpg,jpeg,gif}"],
        tasks: ["imagemin"]
      },
      livereload: {
        files: ["dist/**/*.css", "dist/**/*.{js,json}", "dist/images/**/*.{png,jpg,jpeg,gif,webp,svg}"],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      compile: {
        files: {
          "dist/neue.css": "scss/neue.scss",
          "dist/ie.css": "scss/ie.scss"
        },
        options: {
          sourceComments: "normal"
        }
      }
    },

    cssmin: {
      minify: {
        options: {
          report: "gzip"
        },
        files: {
          "dist/neue.css": ["dist/neue.css"],
          "dist/ie.css": ["dist/ie.css"]
        }
      }
    },

    copy: {
      main: {
        files: [
          {expand: true, src: ["assets/images/**", "!images/**/*"], dest: "dist/"},
          {expand: true, src: ["assets/kss/**"], dest: "dist/"},
          {expand: true, src: ["assets/fonts/**"], dest: "dist/"},
          {src: "scss/helpers.scss", dest: "dist/helpers.scss"},
          {src: "README.md", dest: "dist/README.md"},
          {src: "LICENSE", dest: "dist/LICENSE"},
          {src: "bower.json", dest: "dist/bower.json"},
          {src: "package.json", dest: "dist/package.json"}
        ]
      }
    },


    imagemin: {
      bundle: {
        files: [{
          expand: true,
          cwd: "assets/images/",
          src: ["**/*.{png,jpg,jpeg,gif}"],
          dest: "dist/assets/images"
        }]
      }
    },

    jshint: {
      options: {
        force: true,
        jshintrc: true,
        reporter: require("jshint-stylish")
      },
      all: ["js/**/*.js", "!js/vendor/**/*.js", "!js/polyfills/**/*.js",  "tests/**/*.js", "!tests/wraith/**/*.js", "!tests/lib/**/*.js"]
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
          "dist/neue.js": ["js/**/*.js", "!js/polyfills/**/*.js"],
        }
      },
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true
        },
        files: {
          "dist/neue.js": ["js/**/*.js", "!js/polyfills/**/*.js"],
        }
      }
    },

    docco: {
      docs: {
        src: ["js/*.js"],
        options: {
          output: "dist/docs"
        }
      }
    },

    bump: {
      options: {
        files: ["package.json", "bower.json"],
        commitFiles: ["package.json", "bower.json"],
        updateConfigs: ["pkg"],
        pushTo: "origin",
        createTag: false
      }
    },

    checkrepo: {
      clean: {
        clean: true, // Require repo to be clean (no unstaged changes)
      }
    },

    shell: {
      wraith: {
        command: "cd tests/wraith && rake && open tests/wraith/ds/gallery.html",
        options: {
          stdout: true
        }
      },

      scsslint: {
        command: "scss-lint scss/ --config .scss-lint.yaml",
        options: {
          stdout: true
        }
      },

      clean: {
        command: "rm -rf dist/*"
      },

      dist: {
        command: [
          // destroy current dist branch
          "git branch -D dist",
          "git push origin :dist",

          // create a new dist branch off of master
          "git checkout -b dist ",

          // get rid of everything besides the contents of the dist directory
          "find . -maxdepth 1 ! -name 'dist' ! -name 'node_modules' ! -name '.*' | xargs rm -rf",
          "cp -r dist/* .",
          "rm -rf dist",

          // commit those changes and tag with version
          "git add --all .",
          "git commit -m 'Prepared for distribution.'",
          "git tag -a v<%= pkg.version %> -m 'Version <%= pkg.version %>'",

          // push dist branch and tags to origin
          "git push origin dist --tags",

          // and finally, bring us back to the master branch
          "git checkout master"
        ].join("&&"),
        options: {
          stdout: true,
          failOnError: true
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
  grunt.registerTask("build", ["lint", "sass:compile", "imagemin", "uglify:dev", "copy:main", "docco"]);
  grunt.registerTask("prod", ["shell:clean", "sass:compile", "cssmin:minify", "copy:main", "imagemin", "uglify:prod"]); // used when preparing code for distribution

  // deploy
  grunt.registerTask("deploy", "Runs tests and lints code, compiles for production, deploys master to the dist branch, and makes a git tag.", function(versionType) {
    grunt.task.run("checkbranch:master", "test:js", "lint", "prod", "checkrepo:clean", "bump:" + (versionType || "patch"), "shell:dist");
  });


  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-checkbranch");
  grunt.loadNpmTasks("grunt-checkrepo");
  grunt.loadNpmTasks("grunt-docco2");
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks("grunt-shell");
};
