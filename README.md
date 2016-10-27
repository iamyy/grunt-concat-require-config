# grunt-concat-require-config

> Handle the config file of require in your project which using grunt-contrib-requirejs for optimizing.


## Sample

#### Your requireJS config may looks like this:

``` javascript
requirejs.config( {
    baseUrl : './',
    paths : {
        'zepto'              : './lib/zepto.min',
        'underscore'         : './lib/underscore.min',
        'Backbone'           : './lib/backbone.min',
        'mod_1'              : './page1/mod_1',
        'mod_2'              : './page2/mod_2'
    }
} );
```

#### Your Gruntfile.js may contains this task:

``` javascript
requirejs: {
    build : {
        options : {
            dir: "dist",
            optimize: "uglify",
            removeCombined: true,
            modules : [
                {
                    name : "common",
                    create : true,
                    include : [ "Backbone", "zepto", "underscore" ]
                },
                {
                    name : "page1",
                    exclude : [ "Backbone", "zepto", "underscore" ]
                },
                {
                    name : "page2",
                    exclude : [ "Backbone", "zepto", "underscore" ]
                }
            ],
            baseUrl : 'src',
            mainConfigFile: 'src/config.js'
        }
    }
}
```

#### Then, you can use this Grunt plugin to yield a new config.js
``` javascript
concat_require_config: {
    build : {
        options : {

            // Append md5 code to file name?
            algorithm : 'md5',

            // The length of md5
            length : 8,

            // Delete origin file?
            deleteOriginCombo : true,

            // The main option
            map : {
                "common" : {
                    path : "dist/common.js",
                    include : [ "Backbone", "zepto", "underscore" ]
                }
            }
        },
        dest : "dist/config.js"
    }
},
```
And your new config.js will looks like this:

``` javascript
requirejs.config( {
    baseUrl : './',
    paths : {
        'zepto'              : './common',
        'underscore'         : './common',
        'Backbone'           : './common',
        'mod_1'              : './page1/mod_1',
        'mod_2'              : './page2/mod_2'
    }
} );

```
