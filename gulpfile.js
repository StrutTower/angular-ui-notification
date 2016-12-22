/// <binding ProjectOpened='sass-watch' />
//#region Modules
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cssMin = require('gulp-cssmin'),
    include = require('gulp-include'),
    preprocess = require('gulp-preprocess'),
    templateCache = require('gulp-angular-templatecache'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint');
//#endregion

//#region Options
var options = {
    sass: {
        files: ['src/angular-ui-notification.scss'],
        output: 'angular-ui-notification.css',
        minifiedOutput: 'angular-ui-notification.min.css',
        dest: 'dist'
    },
    js: {
        files: [
            'src/angular-ui-notification.js'
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
//#endregion

//#region Tasks
gulp.task('default', ['sass', 'js']);

gulp.task('template', function () {
    return gulp.src(options.template.files)
        .pipe(templateCache(options.template.options))
        .pipe(gulp.dest(options.template.dest));
});

gulp.task('js', ['template'], function () {
    return gulp.src(options.js.files)
        .pipe(concat(options.js.output))
        .pipe(include())
        .pipe(preprocess())
        .pipe(gulp.dest(options.js.dest))
        .pipe(uglify())
        .pipe(concat(options.js.minifiedOutput))
        .pipe(gulp.dest(options.js.dest));
});

gulp.task('sass', function () {
    return gulp.src(options.sass.files)
        .pipe(sass({ errLogToConsole: true }).on('error', sass.logError))
        .pipe(gulp.dest(options.sass.dest))
        .pipe(cssMin({
            keepSpecialComments: 0
        }))
        .pipe(concat(options.sass.minifiedOutput))
        .pipe(gulp.dest(options.sass.dest));
});

gulp.task('sass-watch', function () {
    return gulp.watch(options.sass.files, ['sass']);
});
//#endregion