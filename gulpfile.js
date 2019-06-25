"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("browser-sync").create();
var del = require("del");

var fileinclude = require("gulp-file-include"); //вставляет фрагменты кода в HTML
var concat = require('gulp-concat'); // склеивает файлы в один
var cleanCSS = require('gulp-clean-css'); //чистит CSS

var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer"); //проставляет префиксы, если они нужны, согласно caniuse.com

gulp.task("css", function() {
	// return gulp.src("app/sass/style.scss")
	return gulp.src("app/sass/*.scss")
	.pipe(sass())
	.pipe(postcss([autoprefixer()]))
	.pipe(concat("style.min.css"))
	.pipe(cleanCSS())
	.pipe(gulp.dest("build/css"))
	.pipe(server.stream());
});

gulp.task("html", function() {
	return gulp.src("app/*.html")
		.pipe(fileinclude({
			prefix: "@@",
			basepath: "app/blocks/"
		}))
		.pipe(gulp.dest("build"));
});

// копирывание файлов в финальную сборку
gulp.task("copy", function(){
	return gulp.src([
		"app/fonts/**/*.{woff, woff2}",
		"app/img/**",
		"app/js/**",
		"app/*.ico"
		], {
			base: "app"
		})
		.pipe(gulp.dest("build"));
});

// удаляет папку "build" для актуализации данных
gulp.task("clean", function() {
	return del("build");
});

gulp.task("server", function () {
	server.init({
		server: "build/",
		notify: false,
		open: true,
		cors: true,
		ui: false
	});

	gulp.watch("app/sass/*.{scss,sass}", gulp.series("css"));
	gulp.watch("app/**/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
	server.reload();
	done();
});

gulp.task("build", gulp.series("clean","html","copy","css"));
gulp.task("start", gulp.series("build", "server"));

