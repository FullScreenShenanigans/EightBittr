module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "paths": {
                "source": "Source",
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
        "typescript": {
            "base": {
                "src": "<%= meta.paths.source %>/<%= pkg.name %>.ts"
            }
        },
        "clean": ["<%= meta.paths.dist %>"],
        "copy": {
            "default": {
                "files": [{
                    "src": "<%= meta.paths.source %>/<%= pkg.name %>.js",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.js"
                }, {
                    "src": "<%= meta.paths.source %>/<%= pkg.name %>.ts",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts"
                }, {
                    "src": "<%= meta.paths.source %>/<%= pkg.name %>.d.ts",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.d.ts"
                }, {
                    "src": "<%= meta.paths.source %>/References/*.ts",
                    "dest": "<%= meta.paths.dist %>/",
                    "expand": true,
                    "flatten": true
                }, {
                    "src": "README.md",
                    "dest": "<%= meta.paths.dist %>/"
                }, {
                    "src": "README.md",
                    "dest": "<%= meta.paths.source %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.paths.dist %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.paths.source %>/"
                }]
            }
        },
        "uglify": {
            "options": {
                "compress": true,
                "sourceMap": true
            },
            "dist": {
                "files": {
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.min.js": ["<%= meta.paths.source %>/<%= pkg.name %>.js"],
                }
            }
        },
        "preprocess": {
            "dist": {
                "src": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts",
                "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts"
            }
        },
        "mocha_phantomjs": {
            "all": ["Tests/*.html"]
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-mocha-phantomjs");
    grunt.loadNpmTasks("grunt-preprocess");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.registerTask("default", [
        "tslint", "typescript", "clean", "copy", "uglify", "preprocess", "mocha_phantomjs"
    ]);
};