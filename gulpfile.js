var browserSync    = require('browser-sync'),
	gulp           = require('gulp'),
	autoprefixer   = require('gulp-autoprefixer'),
	cache          = require('gulp-cache'),
	cleanCSS       = require('gulp-clean-css'),
	cssbeautify    = require('gulp-cssbeautify'),
	imagemin       = require('gulp-imagemin'),
	notify         = require("gulp-notify"),
	rename         = require('gulp-rename'),
	sass           = require('gulp-sass'),
	uglify         = require('gulp-uglify'),
	snippets       = require('sass-snippets');

// Browser Synk
gulp.task('browser-sync', function() {
	browserSync({ server: true, notify: false });
});

// Слежение за JS
gulp.task('dev-js', function() {
	return gulp.src('js/**/*.js')
		.pipe(browserSync.reload({stream: true}));
});

// SASS Компиляция
gulp.task('dev-sass', function() {
	return gulp.src(['sass/**/*.+(sass|scss)','!sass/bootstrap/**/*.+(sass|scss)'])
		.pipe(sass({
			includePaths: snippets.includePaths
		}).on("error", notify.onError()))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cssbeautify({indent: '	'}))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['dev-sass', 'dev-js', 'browser-sync'], function() {
	gulp.watch('sass/**/*.+(sass|scss)', ['dev-sass']);
	gulp.watch('js/**/*.js', ['dev-js']);
	gulp.watch('**/*.html', browserSync.reload);
});

// Сжатие js
gulp.task('build-js', function() {
	return gulp.src('js/**/*.js')
		.pipe(uglify())
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(gulp.dest('js'));
});

// Сжатие css
gulp.task('build-sass', function() {
	return gulp.src(['sass/**/*.+(sass|scss)','!sass/bootstrap/**/*.+(sass|scss)'])
		.pipe(sass({
			includePaths: snippets.includePaths
		}).on("error", notify.onError()))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(gulp.dest('css'));
});

// Компиляция
gulp.task('build', ['build-sass', 'build-js']);

// Минификация изображений
gulp.task('imagemin', function() {
	return gulp.src(['img/**/*','content/**/*'])
		.pipe(cache(imagemin())) // Cache Images
		.pipe(gulp.dest('img-min'));
});

gulp.task('default', ['watch']);
