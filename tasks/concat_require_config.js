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


      if( options.algorithm && options.length ){
        for( var m in options.map ){
          var path = options.map[ m ].path;

          // 计算合并的文件版本号
          var hash = '',
            suffix = '';
            hash = crypto.createHash( options.algorithm ).update( fs.readFileSync(path) ).digest('hex');;
            suffix = hash.slice(0, options.length);

          // 给合并的文件重命名（添加版本号）
          var splitPath = path.split( '/' );
          var fileName = suffix + '.' + splitPath[ splitPath.length - 1 ];
          splitPath.pop();
          var filePath = splitPath.join( '/' );

          grunt.file.write(  filePath + '/' + fileName, grunt.file.read( path ) );

          grunt.log.writeln( path + ' >>> ' + filePath + '/' + fileName );

          options.map[ suffix + '.' + m ] = options.map[ m ];

          if( options.deleteOriginCombo ){
            grunt.file.delete( path );
            grunt.log.writeln( path + ' has been deleted.' );
          }
          delete options.map[ m ];
        }
      }

      // 处理 paths
      for( var module in configJSON.paths ){
          for( var key in options.map ){
            if( options.map[ key ].include.indexOf( module ) != -1 ){
               configJSON.paths[ module ] = key;
               grunt.log.writeln( "MODULE: " + module + ' ---> MODULE: ' + key );
               continue;
            }
          }
      }

      // 处理 shim
      for( var module in configJSON.shim ){
        for( var key in options.map ){
            if( options.map[ key ].include.indexOf( module ) != -1 ){
               delete configJSON.shim[ module ];
               continue;
            }
          }
      }

      grunt.file.write( file.dest, 'requirejs.config(' +  JSON.stringify( configJSON ) + ');' );
      
     
    });
  });

};
