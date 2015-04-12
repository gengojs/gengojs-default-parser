module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    jshint: {
      src: ['lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          './index.js': 'lib/parser/index.js',
          './class/Engine/index.js': 'lib/class/Engine/index.js',
          './class/Filter/index.js': 'lib/class/Filter/index.js',
          './class/Find/index.js': 'lib/class/Find/index.js',
          './class/Regex/index.js': 'lib/class/Regex/index.js',
          './class/Router/index.js': 'lib/class/Router/index.js',
          './class/Type/index.js': 'lib/class/Type/index.js'
        }
      }
    },
    watch: {
      babel: {
        tasks: ['babel'],
        files: 'lib/**/*.js'
      }
    },
    mocha: {
      all: {
        src: 'test/*.js',
        options: {
          globals: ['should', 'it'],
          timeout: 3000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'nyan'
        }
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'babel',
    'watch'
  ]);

  grunt.registerTask('production', [
    'jshint',
    'babel',
    'mocha'
  ]);
};