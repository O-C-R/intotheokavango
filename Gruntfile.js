
var grunt = require('grunt')
require('load-grunt-tasks')(grunt)

// browserify ./static/js/imports.js -o ./static/js/imports-babel.js -t [ babelify --presets [ es2015 ] --plugins [transform-react-jsx] ]


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      browserify: {
        files: ['./static/js/index.js'],
        tasks: ['browserify:index']
      }
    },
    browserify: {
      imports: {
        src: ['./static/js/imports.js'],
        dest: './static/js/imports-babel.js',
        options: {
            transform: [['babelify', {presets: ['es2015'], 'plugins': ['transform-react-jsx']}]]
        }, 
      },
      index: {
        options: {
            transform: [['babelify', {presets: ['es2015'], 'plugins': ['transform-react-jsx']}]]
        },        
        src: ['./static/js/index.js'],
        dest: './static/js/index-babel.js',
      }
    },
    shell: {
      command: 'sudo ./main.py 7777'
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');  
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify:imports','browserify:index','watch']);

};