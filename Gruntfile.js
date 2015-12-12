/*
 * grunt-concat-require-config
 * https://github.com/iamyy/grunt-concat-require-config
 *
 * Copyright (c) 2015 yangyuan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    concat_require_config: {

      build : {

        options : {
          algorithm : 'md5',
          length : 8,
          map : {
            "Common" : [ "Backbone", "UI" ]
          }
        },
        dest : "testConfig.js"
      }
      
      // default_options: {
      //   options: {
      //   },
      //   files: {
      //     'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
      //   }
      // },
      // custom_options: {
      //   options: {
      //     separator: ': ',
      //     punctuation: ' !!!'
      //   },
      //   files: {
      //     'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
      //   }
      // }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'concat_require_config']);

  // By default, lint and run all tests.
  grunt.registerTask('default', [ 'test']);

};
