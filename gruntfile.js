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
				tasks: ['coffee:compile', 'uglify:js', 'docco']
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
					'assets/neue.css': 'scss/neue.scss',
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
					'assets/bin/neue.js': ['coffee/*.coffee']
				},
				options: {
					sourceMap: true
				}
			}
		},
		uglify: {
			js: {
				options: {
					sourceMap: 'assets/neue.js.map',
	        sourceMapIn: 'assets/bin/neue.js.map', // input sourcemap from a previous compilation
				},
				files: {
					'assets/neue.js': ['coffee/vendor/**/*.js', 'assets/bin/neue.js']
				}
			}
		},
	  docco: {
	  	docs: {
	  		src: ['coffee/*.coffee'],
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
	grunt.registerTask('build', ['sass:dist', 'coffee:compile', 'uglify:js', 'docco'])
	grunt.registerTask('default', ['build', 'watch']);
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-docco2');
	grunt.loadNpmTasks('grunt-bump');
};
