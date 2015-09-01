module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['static/js/dummy_data.js','static/js/viz.js','static/js/dataPage.js','static/js/feed.js','static/js/features.js','static/js/gallery.js','static/js/layout.js','static/js/loader.js', 'static/js/map.js', 'static/js/members.js','static/js/timeline.js','static/js/wanderer.js','static/js/utils.js','static/js/main.js'],
        dest: 'static/js/build16.js',
      }
    },
    shell: {
        run: {
            command: 'sudo ./main.py 7777'
        }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', ['concat','shell:run']);

};