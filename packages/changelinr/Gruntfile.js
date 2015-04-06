module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "paths": {
                "source": "Source",
                "dist": "Distribution"
            }
        },
        "typescript": {
            "base": {
                "src": "<%= meta.paths.source %>/<%= pkg.name %>.ts",
                "dest": "<%= meta.paths.dist %>/<%= pkg.name %>.js"
            }
        },
        "mocha": {
            "test": {
                "src": ["Tests/*.html"],
                "options": {
                    "run": true
                }
            }
        },
        "copy": {
            "default": {
                "files": [{
                    "src": "README.md",
                    "dest": "<%= meta.paths.dist %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.paths.dist %>/"
                }]
            }
        },
        "uglify": {
            "options": {
                "compress": true
            },
            "dist": {
                "files": {
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.min.js": ["<%= meta.paths.dist %>/<%= pkg.name %>.js"],
                }
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-mocha");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.registerTask("default", [
        "typescript", "copy", "uglify", "mocha"
    ]);
};