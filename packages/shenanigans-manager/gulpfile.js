var gulp = require("gulp");

gulp.task("clean", function () {
    var del = require("del");

    return del("lib/**/*");
});

gulp.task("tslint", function () {
    var tslint = require("gulp-tslint");

    return gulp.src(["src/**/*.ts", "!src/**/*.d.ts"])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report());
});

gulp.task("tsc", function () {
    var merge = require("merge2");
    var sourcemaps = require("gulp-sourcemaps");
    var gulpTypeScript = require("gulp-typescript");

    var project = gulpTypeScript.createProject("tsconfig.json");
    var output = project
        .src()
        .pipe(sourcemaps.init())
        .pipe(project());

    return merge([
        output.dts.pipe(gulp.dest("lib")),
        output.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("lib"))
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
