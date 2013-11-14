'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      sass: {
        files: ['scss/**/*.{scss,sass}'],
        tasks: ['sass:dist']
      },
      js: {
        files: ['js/vendor/**/*.js', 'js/**/*.js'],
        tasks: ['jshint:all', 'uglify:js', 'docco']
      },
      livereload: {
        files: ['*.html', 'assets/**/*.{js,json}', 'assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'],
        options: {
          livereload: true
        }
      }
    },

    sass: {
      dist: {
        files: {
          'assets/neue.css': 'scss/neue.scss',
          'assets/neue.dev.css': 'scss/neue.dev.scss',
          'assets/ie.css': 'scss/ie.scss'
        },
        options: {
          style: 'compressed'
        }
      }
    },

    jshint: {
        options: {
            force: true,
            jshintrc: true,
            reporter: require('jshint-stylish')
        },
        all: ['js/**/*.js', '!js/vendor/**/*.js', 'test/**/*.js']
    },

    uglify: {
      js: {
        files: {
          'assets/neue.js': ['js/**/*.js', '!js/__*.js']
        }
      }
    },

    docco: {
      docs: {
        src: ['js/*.coffee'],
        options: {
          output: 'assets/docs'
        }
      }
    },

    bump: {
      options: {
        pushTo: 'origin'
      }
    }
  });

  grunt.registerTask('build', ['sass:dist', 'jshint:all', 'uglify:js', 'docco']);
  grunt.registerTask('default', ['build', 'watch']);

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-docco2');
  grunt.loadNpmTasks('grunt-bump');
};