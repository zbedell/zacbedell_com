var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browsersync = require('browser-sync').create(),
    del = require('del');
//var pkg = require('./package.json');


// Styles
gulp.task('styles', function() {
    return gulp.src('less/main.less')
        .pipe(less())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('css'))
        .pipe(browsersync.stream())
});


// Scripts
gulp.task('scripts', function() {
    return gulp.src('js/main.js')
//        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('js'))
            .pipe(browsersync.reload({
            stream:true
    }))
});

// Images
gulp.task('images', function(){
    return gulp.src('img/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('img'))
            .pipe(browsersync.reload({
            stream:true
    }))
});

// Bootstrap
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))
});

// jQuery
gulp.task('jquery', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))
});

// Font Awesome
gulp.task('fontawesome', function() {
    return gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
});

// third party dependencies
gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome']);


// Default task
gulp.task('default', function(){
    gulp.start ('styles', 'scripts', 'images', 'copy', 'watch');
});

// Browser sync static local
gulp.task('browsersync', function() {
    var files = [
        '*.html',
        'less/*.less', 'js/*.js', 'img/*'
    ]
    browsersync.init(files, {
        server: {
            baseDir: ''
        }
    });
});

// Watches
gulp.task('watch', ['browsersync', 'styles', 'scripts', 'images'], function() {
    gulp.watch('less/*.less', ['styles']);
    gulp.watch('css/*.css', ['styles']);
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('img/*', ['images']);
    
    
    gulp.watch('*.html').on('change', browsersync.reload);
    gulp.watch('js/*.js').on('change', browsersync.reload);
    gulp.watch('img/*').on('change', browsersync.reload);
});