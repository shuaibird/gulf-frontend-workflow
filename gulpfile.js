//npm install --save-dev #{node_module}
var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var concat = require('gulp-concat');
var connect = require('gulp-connect');



var sassSources = ['components/sass/style.css'];
var coffeeSources = ['components/coffee/tagline.coffee'];
var scriptSources = ['components/scripts/*.js'];



//sources for liveReload
var htmlSources = ['builds/development/*.html'];
var cssSources = ['builds/development/css/*.css'];
var jsSources = ['builds/development/js/*.js'];
var jsonSources = ['builds/development/js/*.json'];
var allSources = htmlSources.concat(cssSources).concat(jsSources).concat(jsonSources);

gulp.task('server', function() {
	connect.server({
		root: ['builds/development'],
		livereload: true
	});
});
gulp.task('liveReload', function() {
	gulp.src(allSources)
		.pipe(connect.reload());
});

//coffee to js(inside the components dir)
gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true}).on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});

//concat all js components(inculde the required libraries/frameworks) into one js files
gulp.task('concat', function() {
	gulp.src(scriptSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'));
});

//sass to css
gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			css: 'builds/development/css',
			image: 'builds/development/images',
			style: 'expanded'
		}).on('error', gutil.log));
});

//watch for all changes
gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(scriptSources, ['concat']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(allSources, ['liveReload']);
});

//gulp
gulp.task('default', ['coffee', 'concat', 'compass', 'server', 'liveReload', 'watch']);