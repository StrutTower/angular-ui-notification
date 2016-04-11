
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cssMin = require('gulp-minify-css'),
    templateCache = require('gulp-angular-templatecache'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint');

var options = {
    sass: {
        files: ['src/angular-ui-notification.scss'],
        output: 'angular-ui-notification.css',
        minifiedOutput: 'angular-ui-notification.min.css',
        dest: 'dist'
    },
    js: {
        files: [
            'src/angular-ui-notification.js',
            'src/templates.js'
        ],
        output: 'angular-ui-notification.js',
        minifiedOutput: 'angular-ui-notification.min.js',
        dest: 'dist'
    },
    template: {
        files: ['src/angular-ui-notification.html'],
        options: {
            module: 'ui-notification'
        },
        dest: 'src'
    }
}

gulp.task('default', ['sass', 'js']);

gulp.task('templateCache', function () {
    gulp.src(options.template.files)
        .pipe(templateCache(options.template.options))
        .pipe(gulp.dest(options.template.dest));
});

gulp.task('js', ['templateCache'], function () {
    gulp.src(options.js.files)
        .pipe(concat(options.js.output))
        .pipe(gulp.dest(options.js.dest))
        .pipe(uglify())
        .pipe(concat(options.js.minifiedOutput))
        .pipe(gulp.dest(options.js.dest));
});

gulp.task('sass', function () {
    gulp.src(options.sass.files)
        .pipe(sass({ errLogToConsole: true }).on('error', sass.logError))
        .pipe(gulp.dest(options.sass.dest))
        .pipe(cssMin({
            keepSpecialComments: 0
        }))
        .pipe(concat(options.sass.minifiedOutput))
        .pipe(gulp.dest(options.sass.dest));
});