/*
 * grunt-concat-require-config
 * https://github.com/iamyy/grunt-concat-require-config
 *
 * Copyright (c) 2015 yangyuan
 * Licensed under the MIT license.
 */

'use strict';

var crypto = require('crypto');
var fs = require('fs');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('concat_require_config', 'Handle the config file of require in your project which using grunt-contrib-requirejs for optimizing.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      // 配置模块名称与对打包合并后的模块的应路径
      // 比如 Backbone 和 Zepto 通过 grunt-contrib-require 合并为 Common 模块
      // 那么 map : { Common : [ "Backbone", "Zepto" ], ... }
      map : {}
    });

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      // 读取 requirejs 项目 dest 目录中的 requirejs 配置文件( config.js )
      var requireConfigFile = grunt.file.read( file.dest );

      var bIndex = requireConfigFile.indexOf( '{' ),
          eIndex = requireConfigFile.lastIndexOf( '}' );

      var configJSONStr = requireConfigFile.substr( bIndex, eIndex - bIndex + 1 ),
          configJSON = eval("("+configJSONStr+")");

      // 处理 paths
      for( var module in configJSON.paths ){
          for( var key in options.map ){
            if( options.map[ key ].indexOf( module ) != -1 ){
               configJSON.paths[ module ] = key;
               continue;
            }
          }
      }

      // 处理 shim
      for( var module in configJSON.shim ){
        for( var key in options.map ){
            if( options.map[ key ].indexOf( module ) != -1 ){
               delete configJSON.shim[ module ];
               continue;
            }
          }
      }

      var hash = '',
          suffix = '';
      if( options.algorithm && options.length ){
        hash = crypto.createHash( options.algorithm ).update('requirejs.config(' +  JSON.stringify( configJSON ) + ');').digest('hex');;
        suffix = hash.slice(0, options.length);
        grunt.file.delete( file.dest );
      }
      
      grunt.file.write( suffix + '.' + file.dest, 'requirejs.config(' +  JSON.stringify( configJSON ) + ');' );
      
     
    });
  });

};
