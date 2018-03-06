//get basic vars
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const colors = require('colors')

// const pify = require('pify')
// const fsP = pify(fs)

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	less = require('gulp-less'),
	minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	watch = require('gulp-watch');

// img change size
const createImageSizeStream = require('image-size-stream')
// png compress
const PngQuant = require('pngquant')
const PngCrush = require('pngcrush')
// jpeg compress
const sharp = require('sharp')
// svg compress
const zlib = require('zlib')

function timeNow() {
	var date = new Date(),
		HOUR = date.getHours(),
		MINUTES = date.getMinutes(),
		SECONDS = date.getSeconds();
	HOUR = HOUR < 10 ? '0' + HOUR : HOUR;
	MINUTES = MINUTES < 10 ? '0' + MINUTES : MINUTES;
	SECONDS = SECONDS < 10 ? '0' + SECONDS : SECONDS;
	return HOUR + ':' + MINUTES + ':' + SECONDS
}

function progressCount(each_elem, arr_length) {
	var PROGRESS = (each_elem / arr_length * 100).toFixed(2);
	PROGRESS < 10.00 ? PROGRESS = '0' + PROGRESS : PROGRESS;
	return PROGRESS;
}

var onError = function(err) {
	// console.log(err);
	console.log('! - - - ERROR FOUND - - - !'.red)
	console.log('LINE: '.cyan + (err.line || err.cause.line).toString().yellow)
	console.log('FILE: '.cyan + err.fileName.substring(err.fileName.indexOf('src/')).yellow)
	if (err.fileName.substring(err.fileName.indexOf('src/')).indexOf('less') == -1) {
		console.log('MESSAGE: '.cyan + err.cause.message.yellow)
	} else {
		console.log('MESSAGE: '.cyan + err.message.substr(0, err.message.indexOf('in file')).yellow)
	}
	console.log('! - - - - - - - - - - - - !'.red)
	this.emit('end')
}

// var startSass = function() {
// 	var TIME_NOW = '[' + timeNow().gray + ']',
// 		TIME_NOW_RAW = new Date();
// 	console.log(TIME_NOW + ' Started ' + '[scss]'.cyan + ' ...')
//
// 	function getCss() {
// 		gulp.src('src/sass/base_structure.scss')
// 			.pipe(plumber({
// 				errorHandler: onError
// 			}))
// 			// .pipe(sass({ includePaths : ['src/sass/'] }))
// 			.pipe(sass())
// 			.pipe(minifyCSS())
// 			.pipe(rename('style.css'))
// 			.pipe(gulp.dest('./dist/css'))
//
// 		var TIME_AFTER = '[' + timeNow().gray + ']',
// 			TIME_AFTER_RAW = new Date() - TIME_NOW_RAW;
// 		console.log(TIME_AFTER + ' Finished ' + '[scss]'.cyan + ' after ' + TIME_AFTER_RAW.toString().cyan + ' ms'.cyan)
// 	}
// 	return getCss()
// }

var startLess = function() {
	var TIME_NOW = '[' + timeNow().gray + ']',
		TIME_NOW_RAW = new Date();
	console.log(TIME_NOW + ' Started ' + '[less]'.cyan + ' ...')

	function getCss() {
		gulp.src('src/less/_base_structure.less')
			.pipe(plumber({
				errorHandler: onError
			}))
			.pipe(less({
				paths: [path.join(__dirname, 'less', 'includes')]
			}))
			.pipe(minifyCSS())
			.pipe(rename('style.css'))
			.pipe(gulp.dest('dist/css'))

		var TIME_AFTER = '[' + timeNow().gray + ']',
			TIME_AFTER_RAW = new Date() - TIME_NOW_RAW;
		console.log(TIME_AFTER + ' Finished ' + '[less]'.cyan + ' after ' + TIME_AFTER_RAW.toString().cyan + ' ms'.cyan)
	}
	return getCss()
}

function conjureDist() {
	fs.writeFileSync('dist/index.html', '');

	var DIST_PATH = ['css', 'img', 'fonts'];

	for (var i = 0; i < DIST_PATH.length; i++) {
		if (!fs.existsSync('dist/' + DIST_PATH[i] + '/')) {
			fs.mkdirSync('dist/' + DIST_PATH[i] + '/');
			console.log('/dist/'.white + DIST_PATH[i].white + '/'.white + ' CREATED'.green);
			fs.writeFileSync('dist/' + DIST_PATH[i] + '/index.html', '');
		} else {
			console.log('/dist/'.white + DIST_PATH[i].white + '/'.white + ' ALREADY EXISTS'.yellow);
			fs.writeFileSync('dist/' + DIST_PATH[i] + '/index.html', '');
		}
	}

	new Promise(function(resolve, reject) {

			var FONT_ARR = ['Markpro', 'Playfair'];
			fs.readdir('src/fonts/', (err, files) => {

				files.forEach(file => {
					for (var i = 0, MAX = FONT_ARR; i < MAX.length; i++) {
						if (file.indexOf(FONT_ARR[i]) > -1) {
							if (!fs.existsSync('dist/fonts/' + file + '/')) {
								fs.mkdirSync('dist/fonts/' + file + '/');
								fs.writeFileSync('dist/fonts/' + file + '/index.html', '');
								var DIR = file;
								fs.readdir('src/fonts/' + file + '/', (err, files) => {
									files.forEach(file => {
										fs.createReadStream('src/fonts/' + DIR + '/' + file)
											.pipe(fs.createWriteStream('dist/fonts/' + DIR + '/' + file));
									})
									console.log(DIR.white + ' exported'.green)
								})
							}
						}
					}
				})
			})
		})
		.then(startLess())
		// .then(startSass())
}

gulp.task('watch', function() {
	// watch('src/sass/**/*.scss', function() {
	// 	startSass()
	// });
	watch('src/less/**/*.less', function() {
		startLess()
	});
})

gulp.task('build', function() {
	conjureDist()
})

gulp.task('clear', function() {
	rimraf('dist', function() {
		console.log('/dist/'.white + ' deleted'.red);
		fs.mkdirSync('dist');
		console.log('/dist/'.white + ' CREATED'.green);
	})
})
