var gulp = require("gulp");

var createTsProject = (function () {
    var projects = {};
    var gulpTypeScript;

    return function (fileName) {
        if (!gulpTypeScript) {
            gulpTypeScript = require("gulp-typescript");
        }

        return projects[fileName] = gulpTypeScript.createProject(fileName);
    };
})();

gulp.task("clean", function () {
    var del = require("del");

    return del("lib/**/*");
});

gulp.task("tslint", function () {
    var tslint = require("tslint");
    var gulpTslint = require("gulp-tslint");
    var program = tslint.Linter.createProgram("./tsconfig.json");

    return gulp
        .src("./src/**/*.ts")
        .pipe(gulpTslint({
            formatter: "stylish",
            program
        }))
        .pipe(gulpTslint.report())
});

gulp.task("tsc", function () {
    var merge = require("merge2");
    var sourcemaps = require("gulp-sourcemaps");

    var tsProject = createTsProject("tsconfig.json");
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return merge([
        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("lib")),
        tsResult.dts.pipe(gulp.dest("lib"))
    ]);
});

gulp.task("watch", ["tsc"], function () {
    return gulp.watch(["src/**/*.ts"], ["tsc"]);
});

gulp.task("default", function (callback) {
    var runSequence = require("run-sequence").use(gulp);

    runSequence(
        ["clean", "tslint"],
        ["tsc"],
        callback);
});
