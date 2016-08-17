
var grunt = require('grunt')
require('load-grunt-tasks')(grunt)

// browserify ./static/js/imports.js -o ./static/js/imports-babel.js -t [ babelify --presets [ es2015 ] --plugins [transform-react-jsx] ]

// module.exports = function (grunt) {
//   grunt.initConfig({
//     pkg: grunt.file.readJSON('package.json'),
//     browserify: {
//       index: {
        // options: {
        //   spawn: false,
        //   transform: [
        //     'babelify', {
        //       presets: [
        //         'es2015',
        //         'react'
        //       ]
        //     }
        //   ]
        // },
//         src: './static/js/index.js',
//         dest: './static/js/index-babel.js'
//       }
//     },
//     shell: {
//       command: 'sudo ./main.py 7777'
//     }
//   })

//   grunt.loadNpmTasks('grunt-shell')
//   grunt.loadNpmTasks('grunt-contrib-watch')
//   grunt.loadNpmTasks('grunt-browserify')

//   grunt.registerTask('default', ['browserify:index', 'watch'])
// }

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: 'package.json',
    browserify: {
      index: {
        src: 'static/js/index.js',
        dest: 'static/js/index-babel.js',
        options: {
          transform: [
            'babelify', {
              presets: [
                'es2015',
                'react'
              ]
            }
          ]
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
