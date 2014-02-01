module.exports = function(grunt) {
	var portNumber = 3002;
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jade: {
			live:{
				options:{
					pretty: false
				},
				files:{
					'index.html': 'src/jade/index.jade'
				}
			}
		},
		jshint: {
			live:{
				files: {
					src: ['src/js/*.js']
				}
			}
		},
		uglify: {
			live:{
				options: {
					sourceMap: 'assets/js/main.map',
					sourceMapRoot: '/',
					sourceMappingURL: 'http://localhost:' + portNumber + '/assets/js/main.map',
					mangle: true
				}, 
				files: {
					'assets/js/main.js': ['src/js/main.js']
				}
			}
		},
		less: {
			live:{
				options: {
					sourceMap: true,
					sourceMapFilename: 'assets/css/main.map',
					sourceMapBasepath: '/src/',
					sourceMapRootpath: '/'
				},
				files:{
					'assets/css/main.css': ['src/less/main.less']
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: ['src/js/**'],
				tasks: ['js']
			},
			less:{
				files: ['src/less/**'],
				tasks: ['css'],
				options: {
					livereload: false
				}
			},
			css: {
				files: ['assets/css/main.css']
			},
			html:{
				files: ['src/jade/**'],
				tasks: ['html']
			}
		},
		connect:{
			test:{
				options: {
					hostname: '*',
					port : portNumber,
					base: './'
				}
			}
		}
	});
	grunt.registerTask('js','',function(){
		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.task.run(['jshint', 'uglify']);
	});
	grunt.registerTask('css','',function(){
		grunt.loadNpmTasks('grunt-contrib-less');
		grunt.task.run('less');
	});
	grunt.registerTask('html', '', function(){
		grunt.loadNpmTasks('grunt-contrib-jade');
		grunt.task.run('jade');
	});
	grunt.registerTask('default', '', function(){
		grunt.loadNpmTasks('grunt-contrib-connect');
		grunt.task.run('connect');
		grunt.loadNpmTasks('grunt-contrib-watch');
		var shell = require('shelljs');
		if (process.platform.indexOf('win32') === -1){
			shell.exec('open http://localhost:' + portNumber);
		} else {
			shell.exec('start http://localhost:' + portNumber);
		}
		grunt.task.run('watch');
	});
};