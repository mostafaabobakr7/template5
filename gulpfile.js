'use strict';
// include plug-ins:
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var newer = require('gulp-newer');
var htmlclean = require('gulp-htmlclean');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var pump = require('pump');
var plumber = require('gulp-plumber');
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
// src and build :
var htmlSrc = 'src/*.html';
var htmlDest = 'build/';
var sassSrc = 'src/scss/*.scss';
var sassDest ='src/css';
var cssSrc = 'src/css/*.css';
var cssDest = 'build/css';
var jsSrc = 'src/js/*.js';
var jsDest = 'build/js';
var imgSrc = 'src/img/**';
var imgDest = 'build/img';

// move js files(boostrap, jquery, tether) to src :
gulp.task('js', function(){
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/tether/dist/js/tether.min.js'])
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());});
// move css files(bootstrap, font-awsome) to src :
gulp.task('fontawsome-css', function(){
    return gulp.src(['node_modules/font-awesome/css/font-awesome.min.css'])
    .pipe(gulp.dest('src/css'))});
// move font-awsome-fonts :
gulp.task('fontawsome-fonts', function(){
    return gulp.src(['node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest('src/fonts'))});
// ...............................................................
// sass compile files(bootstrap.scss, style.scss) :
gulp.task('sass',function(){
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', sassSrc])
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .on('error',gutil.log)
    .pipe(gulp.dest(sassDest))
    .pipe(browserSync.stream());
});

// sass watch files(bootstrap.scss, style.scss) & serve:
gulp.task('serve',['sass'],function(){
    browserSync.init({
        server : './src'
    });
    gulp.watch(['node_modules/bootstrap/scss/bootstrap.min.scss',sassSrc],['sass']);
    gulp.watch(htmlSrc).on('change',browserSync.reload);
});

// minify Html with htmlclean:
gulp.task('minify-html',function(){
    return gulp.src(htmlSrc)
    .pipe(newer(htmlDest))
    .pipe(htmlclean({
        protect: /<\!--%fooTemplate\b.*?%-->/g,
        edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
      }))
    .pipe(gulp.dest(htmlDest));
});

// minify css with cleanCSS:
gulp.task('minify-css',function(){
    return gulp.src('src/css/style.css')
    .pipe(newer(cssDest))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(cssDest));
});

// minify image with imagemin:
gulp.task('minify-img', function() {
    return gulp.src(imgSrc)
    .pipe(newer(imgDest))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDest));
});

// minify js with uglify:
gulp.task('minify-js', function (cb) {
    pump([
          gulp.src(jsSrc),
          uglify(),
          gulp.dest(jsDest)
      ],
      cb
    );
});

// Concatenate js with concat:



// .....................................
gulp.task('default',['js','serve','fontawsome-css','fontawsome-fonts','minify-html','minify-css','minify-img','minify-js'] ,function(){
    gulp.watch(imgSrc, ['minify-img'])
});

