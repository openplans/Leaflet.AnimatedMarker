module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      banner: '/*\n * L.AnimatedMarker is used to display animated icons on the map.\n */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/AnimatedMarker.js'],
        dest: 'dist/AnimatedMarker.js'
      }
    },
    min: {
      dist: {
        src: ['dist/AnimatedMarker.js'],
        dest: 'dist/AnimatedMarker.min.js'
      }
    },
    lint: {
      files: ['src/AnimatedMarker.js']
    },
    watch: {
      files: ['src/AnimatedMarker.js'],
      tasks: 'default'
    },
    jshint: {
      options: {
        "regexdash": true,
        "browser": true,
        "wsh": true,
        "trailing": true,
        "sub": true,
        "curly": true,
        "eqeqeq": true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');

};