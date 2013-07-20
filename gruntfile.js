module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			sass: {
				files: ['sass/**/*.{scss,sass}'],
				tasks: ['sass:dist']
			},
			coffee: {
				files: ['coffee/**/*.coffee'],
				tasks: ['coffee:compile']
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
					'assets/application.css': 'sass/application.scss'
				},
				options: {
					sourcemap: 'true'
				}
			}
		},
		coffee: {
			compile: {
				files: {
					'assets/application.js': ['coffee/*.coffee', 'js/vendor/*.js']
				},
				options: {
					sourceMap: true
				}
			}
		}
	});
	grunt.registerTask('default', ['watch']);
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
