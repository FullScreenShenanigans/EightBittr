module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "paths": {
                "source": "Source",
                "build": "Build",
                "dist": "Distribution"
            }
        },
        "tslint": {
            "options": {
                "configuration": grunt.file.readJSON("tslint.json")
            },
            "files": {
                "src": ["<%= meta.paths.source %>/*.ts"]
            }
        },
        "clean": ["<%= meta.paths.dist %>/*", "<%= meta.paths.build %>/*"],
        "copy": {
            "default": {
                "files": [{
                    "src": "<%= meta.paths.source %>/*.ts",
                    "dest": "<%= meta.paths.build %>/",
                    "expand": true,
                    "flatten": true
                }, {
                    "src": "<%= meta.paths.source %>/References/*.ts",
                    "dest": "<%= meta.paths.build %>",
                    "expand": true,
                    "flatten": true
                }, {
                    "src": "<%= meta.paths.source %>/References/*.ts",
                    "dest": "<%= meta.paths.dist %>/",
                    "expand": true,
                    "flatten": true
                }, {
                    "src": "README.md",
                    "dest": "<%= meta.paths.dist %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.paths.dist %>/"
                }]
            }
        },
        "preprocess": {
            "default": {
                "src": "<%= meta.paths.build %>/<%= pkg.name %>.ts",
                "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts"
            }
        },
        "typescript": {
            "default": {
                "src": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts"
            }
        },
        "uglify": {
            "options": {
                "compress": true,
                "sourceMap": true
            },
            "default": {
                "files": {
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.min.js": [
                        "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.js"
                    ]
                }
            }
        },
        "mocha_phantomjs": {
            "default": ["Tests/*.html"]
        }
    });
    
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-preprocess");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-mocha-phantomjs");
    grunt.registerTask("default", [
        "tslint", "clean", "copy", "preprocess", "typescript", "uglify", "mocha_phantomjs"
    ]);
};