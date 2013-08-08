module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('etc/package.json'),
		watch: {
			sass: {
				files: ['scss/**/*.{scss,sass}'],
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
					'assets/application.css': 'scss/application.scss',
					'assets/campaign.css': 'scss/campaign.scss',
					'assets/ie.css': 'scss/ie.scss'
				},
				options: {
					sourcemap: 'true',
					style: 'compressed'
				}
			}
		},
		coffee: {
			compile: {
				files: {
					'assets/application.js': ['coffee/*.coffee', 'js/vendor/*.js']
				},
				options: {
					sourceMap: true,
					style: 'compressed'
				}
			}
		}
	});
	grunt.registerTask('default', ['watch']);
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
