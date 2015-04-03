module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "deployPath": "dist"
        },
        "copy": {
            "default": {
                "files": [{
                    "src": "<%= pkg.name %>.js",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "README.md",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.deployPath %>/"
                }]
            }
        },
        "uglify": {
            "options": {
                "compress": true
            },
            "dist": {
                "files": {
                    "<%= meta.deployPath %>/<%= pkg.name %>.min.js": ["<%= meta.deployPath %>/<%= pkg.name %>.js"],
                }
            }
        },
        "clean": {
            "js": ["<%= meta.deployPath %>/<%= pkg.name %>.js"]
        },
        "zip": {
            "using-cwd": {
                "cwd": "<%= meta.deployPath %>/",
                "src": ["**"],
                "dest": "<%= pkg.name %>-v<%= pkg.version %>.zip"
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-zip");
    grunt.registerTask("default", [
        "copy", "uglify", "clean", "zip"
    ]);
};