module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			sass: {
				files: ['scss/**/*.{scss,sass}'],
				tasks: ['sass:dist']
			},
			coffee: {
				files: ['coffee/vendor/**/*.js', 'coffee/**/*.coffee'],
				tasks: ['coffee:compile', 'uglify:js']
			},
			livereload: {
				files: ['*.html', '*.php', 'assets/**/*.{js,json}', 'assets/*.css','img/**/*.{png,jpg,jpeg,gif,webp,svg}'],
				options: {
					livereload: true
				}
			}
		},
		sass: {
			dist: {
				files: {
					'assets/application.css': 'scss/application.scss',
					'assets/campaign.css': 'scss/campaign.scss',
					'assets/ie.css': 'scss/ie.scss'
				},
				options: {
					sourcemap: true,
					style: 'compressed'
				}
			}
		},
		coffee: {
			compile: {
				files: {
					'assets/bin/application.js': ['coffee/*.coffee']
				},
				options: {
					sourceMap: true
				}
			}
		},
		uglify: {
			js: {
				options: {
					sourceMap: 'application.js.map',
	        sourceMapIn: 'assets/bin/application.js.map', // input sourcemap from a previous compilation
				},
				files: {
					'assets/application.js': ['coffee/vendor/**/*.js', 'assets/bin/application.js']
				}
			}
		}
	});
	grunt.registerTask('default', ['watch']);
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
