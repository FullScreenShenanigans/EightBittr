const gulp = require("gulp");
const merge = require("merge2");
const mochaPhantomJS = require("gulp-mocha-phantomjs");
const runSequence = require("run-sequence");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");

gulp.task("tslint", () => {
    return gulp
        .src("src/*.ts")
        .pipe(tslint())
        .pipe(tslint.report("verbose"));
});

gulp.task("tsc", () => {
    const tsProject = ts.createProject("tsconfig.json");

    return tsProject
        .src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("src"));
});

gulp.task("test", () => {
    return gulp
        .src("test/unit/index.html")
        .pipe(mochaPhantomJS());

});

gulp.task("dist", function() {
    const tsResult = gulp
        .src("src/**/*.ts")
        .pipe(ts());
 
    return merge([
        tsResult.dts.pipe(gulp.dest("dist")),
        tsResult.js.pipe(gulp.dest("dist"))
    ]);
});

gulp.task("watch", ["default"], () => {
    gulp.watch("src/**/*.ts", ["default"]);
});

gulp.task("default", ["tsc", "tslint", "dist"], cb => {
    runSequence(["test"], cb);
});
