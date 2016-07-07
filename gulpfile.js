var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
var buffer = require("vinyl-buffer"); // used to buffer js for use
var source = require("vinyl-source-stream"); // used to stream js into other functions
var babelify = require("babelify");
var browserify = require("browserify");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");

/*

Setup BrowserSync as a server for the root directory where the gulpfile is.

*/
gulp.task("serve", ["watch"], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // browserSync.init({
    //     proxy: "localhost"
    // });
});

gulp.task("watch", function () {
    gulp.watch("app/scss/**/*.scss", ["sass"], reload); // compile CSS and reload
    gulp.watch("app/src/**/*.js", ["js"]); // compile JS

    gulp.watch("./*.html").on("change", reload); // if html in root changes, reload
    gulp.watch("app/js/*.js").on("change", reload); // if js changes, reload
});

/*

Compile SASS and reload the browser

*/
gulp.task("sass", function () {
    return gulp.src("app/scss/**/*.scss") // match subdirs and scss files
    .pipe(sass())
    .on("error", onError)
    .pipe(gulp.dest("app/css"))
    .pipe(reload({ stream: true }));
});

/*

Compile JavaScript

*/
gulp.task("js", function () {
    var bundler = browserify("app/src/app.js");
    bundler.transform(babelify);
    bundler.bundle()
    .on("error", onError)
    .pipe(source("app.js"))
    //.pipe(buffer())
    //.pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify())
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("app/js"))
});

function onError(error) {
    console.log(error);
    this.emit('end');
}

gulp.task("default", ["serve"]);
