/* basic */ 
const fs 							= require('fs')
const shell 						= require('shelljs')
const pathFunc 						= require('path')
const childProcess 					= require('child_process')
const spawn 						= childProcess.spawn
const exec 							= childProcess.execSync
const fileType 						= require('file-type')
const rimraf 						= require('rimraf')
const colors 						= require('colors')
const readChunk 					= require('read-chunk')
// const util 							= require('util')

const { PassThrough, Transform } 	= require('stream');
const stream 						= require('stream');

/* gulp */
var gulp 							= require('gulp'),
	less 							= require('gulp-less'),
	minifyCSS 						= require('gulp-minify-css'),
	jsonMinify 						= require('gulp-json-minify'),
	sourcemaps 						= require('gulp-sourcemaps'),
	babel 							= require('gulp-babel'),
	concat 							= require('gulp-concat'),
	uglify 							= require('gulp-uglify'),
	plumber 						= require('gulp-plumber'),
	rename 							= require('gulp-rename'),
	watch 							= require('gulp-watch'),
	webserver 						= require('gulp-webserver'),
	streamify 						= require('gulp-streamify');

const listsLess 					= require('less-plugin-lists')
var lists 							= new listsLess();

/* react elements */
const browserify = require('browserify')
const babelify = require('babelify');
const reactify = require('reactify')
const source = require('vinyl-source-stream')
// const browserSync = require('browser-sync')
// const sync = browserSync.create()



	

/* generate listChars from svg files */
const SVGIcons2SVGFontStream 		= require('svgicons2svgfont')
const iconfont 						= require('gulp-iconfont')
const fontgen 						= require('./node_modules_lib/gulp-fontgen/index.js')	
const fontfacegen					= require('fontfacegen')

const otf2ttf 						= require('otf2ttf')



/* compress */
var fontmin 						= require('./node_modules_lib/gulp-fontmin/index.js')

const zlib 							= require('zlib')
const mozjpeg 						= require('mozjpeg-stream') // jpeg compress
const PngCrush 						= require('pngcrush') // png compress
const PngQuant 						= require('pngquant') // png color improvement

const Gifsicle 						= require('gifsicle-stream') // gif compressor

const imStream 						= require('./node_modules_lib/im-stream.js') // jpeg, png, gif resize


/* lib nodes */
const compressPdf 					= require('./node_modules_lib/compress-pdf/index.js')

const fileSize 						= require('./node_modules_lib/file-size.js')
const sizeDecreasePercent 			= require('./node_modules_lib/size-decrease-percent.js')
const compressedSizeCheck 			= require('./node_modules_lib/compressed-size-check.js')
const progressCount 				= require('./node_modules_lib/progress-count.js')

const displayProgress 				= require('./node_modules_lib/display-progress.js')
const displayInfo 					= require('./node_modules_lib/display-info.js')
const displayDeleted 				= require('./node_modules_lib/display-deleted.js')
const generateLog 					= require('./node_modules_lib/generate-log')

const listFiles 					= require('./node_modules_lib/list_files/list_files.js')

const createDir 					= require('./node_modules_lib/create-dir.js')
const createWebDir = (dist) => {
	createDir(dist, {
		'generate_indexhtml': true,
		'log_action': true
	})
}

const changeExt = require('./node_modules_lib/change-ext')

const timeNow = require('./node_modules_lib/time-now.js')
const timeFromMs = require('./node_modules_lib/time-from-ms.js')
// const checkIf = require('./node_modules_lib/check-if.js')
const applyDefaults = require('./node_modules_lib/apply-defaults.js')
const checkDuplicates = require('./node_modules_lib/check-duplicates.js')

const changeSvgColor = require('./node_modules_lib/change-svg-color.js')

const onErrorBabel = require('./node_modules_lib/on-error-babel.js')
const onError = require('./node_modules_lib/on-error.js')
const streamSkip = require('./node_modules_lib/stream-skip.js')


// settings
const settingProjects = require('./settings.js');

colors.setTheme({
	sizeColor: ['strikethrough', 'bold', 'dim'],
	compressedSizeColor: ['bold'],
	arrowColor: ['cyan'],
	fileColor: ['italic'],
	duplicatedColor: ['bold', 'red']
});

// var eventObj = {
	// 	"eventArr": new Array,
	// 	"timeoutHandle": false,
	// 	"_await": false
// }

var eventArr = new Array;
var timeoutHandle = false;
var _await = false;
var runFontGlyph = true;
var runFonts = true;
	
const watchAssets = (dataObj) => {

	const _s = {
		"projName": 			[ dataObj.settings.projName, dataObj.settings.instanceName ], 
		"watch": 				dataObj.settings.watch,

		// "buildBaseDist":		[ dataObj.settings.dist.buildBase.project, dataObj.settings.dist.buildBase.instance ],

		"baseSrc":				dataObj.settings.dist.base,
		"baseDist":				dataObj.settings.dist.base.dir,
		"baseDirStructure":		dataObj.settings.dist.base.options.dirStructure,

		"stylesSrc":			dataObj.settings.src.less,
		"scriptsSrc":			dataObj.settings.src.js,
		"reactSrc":				dataObj.settings.src.react,

		"stylesDist": 			dataObj.settings.dist.styles.dir,
		"stylesDirStructure": 	dataObj.settings.dist.styles.options.dirStructure,

		"scriptsDist": 			dataObj.settings.dist.scripts.dir,
		"scriptsDirStructure": 	dataObj.settings.dist.scripts.options.dirStructure,

		"reactDist": 			dataObj.settings.dist.react.dir,
		"reactDirStructure": 	dataObj.settings.dist.react.options.dirStructure,

		"jsonDist": 			dataObj.settings.dist.json.dir,
		"jsonDirStructure": 	dataObj.settings.dist.json.options.dirStructure,

		"fontsDist": 			dataObj.settings.dist.fonts.dir,
		"fontsDirStructure": 	dataObj.settings.dist.fonts.options.dirStructure,
		"fontsExtensions": 		dataObj.settings.dist.fonts.extensions,
		"fontLanguages": 		dataObj.settings.dist.fonts.options.fontLanguages,

		"imagesDist":	 		dataObj.settings.dist.images.dir,
		"imagesDirStructure": 	dataObj.settings.dist.images.options.dirStructure,
		"imagesSizing": 		dataObj.settings.dist.images.options.imagesSizing,
		"svgOptions":	 		dataObj.settings.dist.images.options.svg,

		"pdfDist": 				dataObj.settings.dist.pdf.dir,
		"pdfDirStructure": 		dataObj.settings.dist.pdf.options.dirStructure
	}

	const _args = dataObj.args;

	// define proj names
	let projName = _s.projName[0]
	let instanceName = _s.projName[1]

	// styles and scripts src
	let stylesSrc = _s.stylesSrc,
		scriptsSrc = _s.scriptsSrc,
		reactSrc = _s.reactSrc;

	// base dist
	let baseDist;
	_s.baseDirStructure 	? baseDist 		= _s.baseDist + '/' + _args.distTree	: baseDist 		= _s.baseDist + '/';

	// styles and scripts dist
	let stylesDist,
		scriptsDist,
		reactDist;

	if (_s.stylesDist) {
		_s.stylesDirStructure 	? stylesDist 	= _s.stylesDist + '/' + _args.distTree.substr(0, _args.distTree.length - 1) 	: stylesDist 	= _s.stylesDist;
	} else if (!_s.stylesDist) {
		stylesDist = baseDist
	}
	
	if (_s.scriptsDist) {
		_s.scriptsDirStructure 	? scriptsDist 	= _s.scriptsDist + '/' + _args.distTree.substr(0, _args.distTree.length - 1) 	: scriptsDist 	= _s.scriptsDist;
	} else if (!_s.scriptsDist) {
		scriptsDist = baseDist
	}
	
	if (_s.reactDist) {
		_s.reactDirStructure 	? reactDist 	= _s.reactDist + '/' + _args.distTree.substr(0, _args.distTree.length - 1) 	: reactDist 	= _s.reactDist;
	} else if (!_s.reactDist) {
		reactDist = baseDist
	}

	// json, fonts, images, pdf dist
	let	jsonDist,
		fontsDist,
		imagesDist,
		pdfDist;

	if (_s.jsonDist) {
		_s.jsonDirStructure 	? jsonDist 		= _s.jsonDist + '/' + _args.distTree	: jsonDist = _s.jsonDist + '/';
	} else if (!_s.jsonDist) {
		jsonDist = baseDist + '/';
	}

	if (_s.fontsDist) {
		_s.fontsDirStructure 	? fontsDist 	= _s.fontsDist + '/' + _args.distTree	: fontsDist = _s.fontsDist + '/';
	} else if (!_s.fontsDist) {
		fontsDist = baseDist + '/';
	}

	if (_s.imagesDist) {
		_s.imagesDirStructure 	? imagesDist 	= _s.imagesDist + '/' + _args.distTree	: imagesDist = _s.imagesDist + '/';
	} else if (!_s.imagesDist) {
		imagesDist = baseDist + '/';
	}

	if (_s.pdfDist) {
		_s.pdfDirStructure 		? pdfDist 		= _s.pdfDist + '/' + _args.distTree		: pdfDist = _s.pdfDist + '/';
	} else if (!_s.pdfDist) {
		pdfDist = baseDist + '/';
	}

	// images options
	let	sizing = _s.imagesSizing,
		sizingLen = sizing.length;
	let svgOptions = _s.svgOptions,
		svgOptionsLen = _s.svgOptions.length;

	// fonts options
	let fontLanguages = _s.fontLanguages;

	let	fontsExtensions = _s.fontsExtensions,
		fontsExtensionsLen = fontsExtensions.length;

	// set this func variables
	let event, path, ext, extName, fileName, input, output, tree, distTree;
	let dist, group;
	
	// setting args
	event = _args.event
	tree = _args.tree
	distTree = _args.distTree
	path = _args.path + tree // needed for src
	fileName = _args.fileName
	ext = _args.ext
	extName = _args.extName // needed to ignore js, less

	input = path + fileName
 
	switch (extName) {
		case 'less':
		dist = stylesDist
		group = 'less'
		break;

		case 'js':
		dist = scriptsDist
		group = 'js'
		break;

		case 'jsx':
		dist = reactDist
		group = 'jsx'
		break;

		case 'json':
		dist = jsonDist
		group = 'json'
		break;

		case 'otf':
		case 'ttf':
		dist = fontsDist
		group = 'fonts'
		break;

		case 'svgph':
		dist = fontsDist
		group = 'fontGlyphs'
		break;
		
		case 'jpg':
		case 'jpeg':
		case 'jpe':
		case 'png':
		case 'svg':
		case 'gif':
		dist = imagesDist
		group = 'images'
		break;

		case 'pdf':
		dist = pdfDist
		group = 'pdf'

		default: dist = baseDist
	}

	output = dist + fileName

	eventArr.push({
		"event": event, 
		"fileName": fileName,
		"extName": extName,
		"ext": ext,
		"path": path,
		"input": input,
		"output": output,
		"dist": dist,
		"group": group
	})

	if (_await) {
		// make keepList and delList on await
	}
	
	if (!_await && timeoutHandle) {
		clearTimeout(timeoutHandle);

		runFontGlyph = true // once per session
		runFonts = true // once per session
	}
		
	if (!_await) timeoutHandle = setTimeout(() => {

		_await = true;

		// transform functions for generating more sizes etc. from one file
		let transformJPG, transformPNG, transformSVG, generateColorIcons, generateColorIconsSmall;

		// containers for objects to keep or delete
		let delList = new Array;
		let keepList = new Array;
		
		let eventArrLen = eventArr.length;

		let projectIcons = new Array;

		for (let a = 0; a < eventArrLen; a++) {
			event = eventArr[a].event

			let fileObj = {
				"fileName": eventArr[a].fileName,
				"extName": 	eventArr[a].extName,
				"ext": 		eventArr[a].ext,
				"path": 	eventArr[a].path,
				"input": 	eventArr[a].input,
				"output": 	eventArr[a].output,
				"dist": 	eventArr[a].dist,
				"group": 	eventArr[a].group
			}

			if (
				//////ignore list
				!(	
						(		fileObj.fileName 	===	'index.html'
							||	fileObj.fileName 	===	'.DS_Store'			)
					||	(
								fileObj.fileName.indexOf('listChars') > -1
							&&	extName === 'svg'
						)
					||	(fileObj.extName 	===	'zip'					)
					||	(fileObj.extName 	===	'rar'					)
					||	(fileObj.extName 	===	'7z'					)
				)
			) {

				if (event === 'unlink') {
					delList.push(fileObj)

				} else if (event === 'change' || event === 'add') {
					keepList.push(fileObj)

				}

			// } else {
			// 	console.log(fileObj.fileName + ' ignored'.red);
			}
		}

		// prevent multiple script fireing on multiple files changed in one row
		let less_once = true,
			js_once = true,
			jsx_once = true,
			iconColors_once = true
		
		// reset data collect
		eventArr = new Array;
		
		// transform
		let delListLen = delList.length,
			keepListLen = keepList.length;
			
		var transformFiles = (k) => {
			if (k < keepListLen) {
				let fileName = keepList[k].fileName,
					extName = keepList[k].extName,
					ext = keepList[k].ext,
					path = keepList[k].path,
					input = keepList[k].input,
					output = keepList[k].output,
					dist = keepList[k].dist,
					group = keepList[k].group;


				createWebDir( [dist] )
				

				let s = 0; // sizing count
				let detectDuplicate = () => {
					if (
							(group === 'images')
						&& 	(ext === 'jpg' || ext === 'png')
						&& 	s < sizingLen
					) {
						let sizePx = sizing[s].size,
							sizeName;

						sizing[s].name.length > 0 ? sizeName = '_' + sizing[s].name : sizeName = '';

						let ffName = fileName.split('.') // file first name, without ext
						ffName.pop()
						ffName = ffName.join('.')
						ffName = ffName + sizeName + '.' + extName
						let sizingOutput = dist + ffName

						if (fs.existsSync(sizingOutput)) {
							console.log('[' + timeNow().dim + ']         ' + sizingOutput.fileColor + ' already exists and will be overwritten by '.duplicatedColor + ffName.fileColor);
						}

						s++ 	
						detectDuplicate()

					} else if (
							group === 'images'
						&& 	extName === 'svg'
					) {
						////////////////////////////////////////////// svg icons
						if (fs.existsSync(output + 'z')) {
							console.log('[' + timeNow().dim + ']         ' + (output + 'z').fileColor + ' already exists and will be overwritten by '.duplicatedColor + fileName.fileColor);
							// return

							// if ( detectIfCompressed )
							// if (  )
						}

					} else {
						// detect duplicated files
						if (fs.existsSync(output)) {
							console.log('[' + timeNow().dim + ']         ' + output.fileColor + ' already exists and will be overwritten by '.duplicatedColor + fileName.fileColor);
							// return

							// if ( detectIfCompressed )
							// if (  )
						}
					}
				}
				detectDuplicate()


				if (group === 'less') {
					if (less_once) {
						less_once = false

						let time_now = new Date();

						gulp
							.src(stylesSrc)
							.pipe(plumber({
								errorHandler: onError
							}))
							.pipe(sourcemaps.init())
							.pipe(less({
								paths: [pathFunc.join(__dirname, 'less', 'includes')],
								plugins: [lists]
							}))
							.pipe(minifyCSS())
							.pipe(rename('style.css'))
							.pipe(gulp.dest(dist))
							.on('end', function() {

								if ( fs.existsSync(`${dist}/style.css`) ) {
									generateLog(instanceName, 'less', dist + '/' + 'style.css', dist + '/' + 'style.css', new Date() - time_now)

									k++
									transformFiles(k)
								} else {		
									fs.createWriteStream(`${dist}/style.css`)
									setTimeout(() => {
										transformFiles(k)
									}, 50)
								}
						
							})

					} else {
						// ignore rest
						k++
						transformFiles(k)
					}

				} else if (group === 'js') {
					if (js_once) {
						js_once = false

						let time_now = new Date();

						gulp
							.src(scriptsSrc)
							.pipe(sourcemaps.init())
							.pipe(babel({
								presets: ['es2015', 'stage-0']
								// , plugins: ['transform-class-properties']
							}))
							// .pipe(plumber({
							// 	errorHandler: onError
							// }))
							.on('error', (error) => {
								onErrorBabel(error)

								k++
								transformFiles(k)
							})
							.pipe(uglify({
								mangle: false
							}))
							.pipe(concat('script.js'))
							.pipe(gulp.dest(dist))
							.on('end', function() {
						
								if ( fs.existsSync(`${dist}/script.js`) ) {
									generateLog(instanceName, 'js', dist + '/' + 'script.js', dist + '/' + 'script.js', new Date() - time_now)

									k++
									transformFiles(k)
								} else {		
									fs.createWriteStream(`${dist}/script.js`)
									setTimeout(() => {
										transformFiles(k)
									}, 50)
								}
							})

					} else {
						// ignore rest
						k++
						transformFiles(k)
					}

				} else if (group === 'jsx') {	
					if (jsx_once) {
						jsx_once = false

					let time_now = new Date();

					browserify(reactSrc)
						.transform(babelify, { presets: ['es2015', 'react', 'stage-0'] })
						.bundle()
						.on('error', (error) => {
							onErrorBabel(error)

							k++
							transformFiles(k)
						})
						.pipe(source('app.js'))
						.pipe(streamify(uglify()))
						.pipe(gulp.dest(dist))
						.on('end', function() {
						
							if ( fs.existsSync(`${dist}/app.js`) ) {
								generateLog(instanceName, 'jsx', dist + '/' + 'app.js', dist + '/' + 'app.js', new Date() - time_now)

								k++
								transformFiles(k)
							} else {		
								fs.createWriteStream(`${dist}/app.js`)
								setTimeout(() => {
									transformFiles(k)
								}, 50)
							}
						})

					// gulp.src(reactSrc)
					// 	.pipe(sourcemaps.init())
					// 	.pipe(babel({
					// 		presets: ['es2015','react', 'stage-0']
					// 	}))
					// 	.on('error', (error) => {
					// 		onErrorBabel(error)

					// 		k++
					// 		transformFiles(k)
					// 	})
					// 	.pipe(concat('app.js'))
					// 	.pipe(uglify())
					// 	.pipe(sourcemaps.write('.'))
					// 	.pipe(gulp.dest(dist))
					// 	.on('end', function() {
					// 		if ( fs.existsSync(`${dist}/app.js`) ) {
					// 			generateLog(instanceName, 'jsx', dist + '/' + 'app.js', dist + '/' + 'app.js', new Date() - time_now)

					// 			k++
					// 			transformFiles(k)
					// 		} else {		
					// 			fs.createWriteStream(`${dist}/app.js`)
					// 			setTimeout(() => {
					// 				transformFiles(k)
					// 			}, 50)
					// 		}
					// 	})
					
					} else {
						// ignore rest
						k++
						transformFiles(k)
					}

				} else if (group === 'json') {
					gulp
						.src(input)
						.pipe(jsonMinify())
						.pipe(gulp.dest(dist))
						.on('end', function() {
							if ( fs.existsSync(output) ) {
								displayProgress(k, keepListLen, input, output, fileName)
								k++
								transformFiles(k)
							} else {
								setTimeout(() => {
									transformFiles(k)
								}, 50)
							}
						})

				} else if (group === 'pdf') {
					compressPdf(
						input,
						output,
						'screen',
						function(input, output) {
							if ( fs.existsSync(output) ) {
								displayProgress(k, keepListLen, input, output, fileName)
								k++
								transformFiles(k)
							} else {
								setTimeout(() => {
									transformFiles(k)
								}, 50)
							}
						}
					)

				} else if (group === 'fonts') {
					
					if (runFonts) {
						runFonts = false // once per session

						let fontFullPath, fontFullPathLen, fontName;

						gulp.src([`${path}**/*.${extName}`])
							.pipe(
								fontgen({
									dest: dist
								})
							)
							.on('data', (data) => {
								fontFullPath = JSON.parse( JSON.stringify(data) ).history[0].split('/')
								fontFullPathLen = fontFullPath.length

								fontName = fontFullPath[fontFullPathLen - 1] // come on, it's always more than 1

								displayInfo(fontName, 'exported', {
									color: 'green',
									status: 'start'
								})								
							})
							.on('end', () => {
								displayInfo('Simon says', 'Fonts successfully generated!', {
									color: 'green',
									status: 'end'
								})
								k++
								transformFiles(k)
							})

					} else {
						k++
						transformFiles(k)
					}

				} else if (group === 'fontGlyphs') {

					if (runFontGlyph) {
						runFontGlyph = false // once per session

						const charsFontName = 'listChars'

						let glyphs = listFiles(path.substr(0, path.length - 1)).svgph,
							glyphsLen = glyphs.length;

			
							
							let addGlyphs = (i) => {
								if (i < glyphsLen) {
									
								let gn = glyphs[i].fileName.split(/[._]/),
									gnLen = gn.length,
									number = parseInt( gn[gnLen - 2] );

								if (number < 10) number = '0' + number

								fs.createReadStream(glyphs[i].dir + glyphs[i].fileName)
									.on('end', () => {
										
										displayProgress(i, glyphsLen, glyphs[i].dir + glyphs[i].fileName, dist + changeExt(`uEA${number}-${glyphs[i].fileName}`, 'svg'), changeExt(`uEA${number}-${glyphs[i].fileName}`, 'svg'))
										
										i++
										addGlyphs(i)
									})
									.pipe( fs.createWriteStream( dist + changeExt(`uEA${number}-${glyphs[i].fileName}`, 'svg') ) )
								
							} else {

								let runTimestamp = Math.round(Date.now()/1000);

								gulp.src([`${dist}**/*.svg`])
								.pipe(
									iconfont({
										fontName: charsFontName, // required
										prependUnicode: true, // recommended option
										formats: ['ttf', 'eot', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available
										timestamp: runTimestamp, // recommended to get consistent builds when watching files
										normalize: true,
										fontHeight: 1001,
										centerHorizontally: true,
									})
								)
								// .on('glyphs', (glyphs, options) => {
								// // CSS templating, e.g.
								// console.log(glyphs, options);
								// })
								.on('end', () => {
									displayInfo('Simon says', 'Font glyphs successfully created!', {
										color: 'green',
										status: 'end'
									})

									k++
									transformFiles(k)
								})
								.pipe(gulp.dest(dist));

							}
						}
						addGlyphs(0)

					} else {
						k++
						transformFiles(k)
					}

				} else if (group === 'images') {

					if (ext === 'jpg') {
					
						transformJPG = (s) => {

							if (s < sizingLen) {

								let sizePx = sizing[s].size,
									sizeName;

								sizing[s].name.length > 0 ? sizeName = '_' + sizing[s].name : sizeName = '';

								let ffName = fileName.split('.') // file first name, without ext
								ffName.pop()
								ffName = ffName.join('.')
								ffName = ffName + sizeName + '.' + extName
								
								let sizingOutput = dist + ffName

								fs.createReadStream(input)
									.pipe(
										mozjpeg({
											quality: 85 // default is 75 // good is 85
										}) 
									)
									// imagemagick x1200 => width / 1200x => height
									.pipe( imStream(['-unsharp', '0x1', '-resize', `x${sizePx}>`, '-resize', `${sizePx}x>`]) )
									.on('end', function() {
										if ( fs.existsSync(sizingOutput) ) {
											displayProgress(false, false, input, sizingOutput, ffName)
											s++
											transformJPG(s)
										} else {
											setTimeout(() => {
												transformJPG(s)
											}, 50)
										}
									})
									.pipe(fs.createWriteStream(sizingOutput))
									 
							} else {

								let identifyImage = spawn('identify', [input]);
								identifyImage.stdout.on('data', (chunk) => {
									let cb, imgWidth, imgHeight;

									cb = String(chunk).split( 'JPEG' + ' ' )[1].split(' ')
									imgWidth = cb[0].split('x')[0]
									imgHeight = cb[0].split('x')[1]

									fs.createReadStream(input)
										.pipe(
											mozjpeg({
												quality: 85 // default is 75 // good is 85
											}) 
										)
										.pipe( imStream(['-unsharp', '0x1', '-resize', `${imgWidth}x`]) ) // weird but resizing to same size compress image a bit
										.on('end', function() {
											if ( fs.existsSync(output) ) {
												displayProgress(k, keepListLen, input, output, fileName)
												k++
												transformFiles(k)
											} else {
												setTimeout(() => {
													transformFiles(k)
												}, 50)
											}
										})
										.pipe(fs.createWriteStream(output))

								});
							}
						}
						transformJPG(0)

					} else if (ext === 'png') {

						transformPNG = (s) => {

							if (s < sizingLen) {

								let sizePx = sizing[s].size,
									sizeName;

								sizing[s].name.length > 0 ? sizeName = '_' + sizing[s].name : sizeName = '';

								let ffName = fileName.split('.') // file first name, without ext
								ffName.pop()
								ffName = ffName.join('.')
								ffName = ffName + sizeName + '.' + extName
								
								let sizingOutput = dist + ffName

								fs.createReadStream(input)
									.pipe( imStream(['-unsharp', '0x1', '-resize', `x${sizePx}>`, '-resize', `${sizePx}x>`]) )
									.pipe( new PngQuant([192, '--speed', '1', '--quality', '5-90', '-']) )
									.pipe( new PngCrush(['-res', 64, '-rem', 'alla']) )
									.on('end', function() {
										if ( fs.existsSync(sizingOutput) ) {
											displayProgress(false, false, input, sizingOutput, ffName)
											s++
											transformPNG(s)
										} else {
											setTimeout(() => {
												transformPNG(s)
											}, 50)
										}
									})
									.pipe(fs.createWriteStream(sizingOutput))
									
							} else {

								let identifyImage = spawn('identify', [input]);
								identifyImage.stdout.on('data', (chunk) => {
									let cb, imgWidth, imgHeight;

									cb = String(chunk).split( 'PNG' + ' ' )[1].split(' ')
									imgWidth = cb[0].split('x')[0]
									imgHeight = cb[0].split('x')[1]

									fs.createReadStream(input)
										.pipe( imStream(['-unsharp', '0x1', '-resize', `${imgWidth}x`]) ) // weird but resizing to same size compress image a bit
										.pipe( new PngQuant([192, '--speed', '1', '--quality', '5-90', '-']) )
										.pipe( new PngCrush(['-res', 64, '-rem', 'alla']) )
										.on('end', function() {
											if ( fs.existsSync(output) ) {
												displayProgress(k, keepListLen, input, output, fileName)
												k++
												transformFiles(k)
											} else {
												setTimeout(() => {
													transformFiles(k)
												}, 50)
											}
										})
										.pipe(fs.createWriteStream(output))

								});
							}
						}
						transformPNG(0)
 
					} else if ( extName === 'gif' ) {
						fs.createReadStream(input)
							// .pipe( new Gifsicle(['-w', '-O3']) )
							// .pipe( new Gifsicle(['--resize-fit-width', '300', '-b', '--colors', '256', '--use-col=web']) )
							.pipe( new Gifsicle(['--resize-fit-width', '300',]) )
							.on('end', function() {
								if ( fs.existsSync(output) ) {
									displayProgress(k, keepListLen, input, output, fileName)
									k++
									transformFiles(k)
								} else {
									setTimeout(() => {
										transformFiles(k)
									}, 50)
								}
							})
							.pipe(fs.createWriteStream(output))

					} else if ( extName === 'svg' ) {

						if (fileName.indexOf('i_setColor_') > -1) {

							// only generate icon files
							generateColorIconsSmall = (i) => {
								if (i < svgOptionsLen) {

									let colorName = svgOptions[i].colorName,
										hash = svgOptions[i].hash,
										hashDarker = svgOptions[i].hashDarker;
									
									let fileNameIcon = fileName.replace(/_setColor/, '_' + svgOptions[i].colorName) + 'z'
									output = dist + fileNameIcon

									fs.createReadStream(input)
										.pipe( 
											changeSvgColor(
												[
													{
														baseColor: '#cccccc',
														newColor: hash
													}, {
														baseColor: '#ccc',
														newColor: hash
													}, {
														baseColor: '#999999',
														newColor: hashDarker
													}, {
														baseColor:'#999',
														newColor: hashDarker
													}
												]
											) 
										)
										.pipe( zlib.Gzip() )
										.on('end', function(data) {
											setTimeout(() => {
												if (i === svgOptionsLen - 1) {
													
													if ( fs.existsSync(output) ) {
														displayProgress(k, keepListLen, input, output, fileName)
														i++
														generateColorIconsSmall(i)
													} else {
														setTimeout(() => {
															generateColorIconsSmall(i)
														}, 50)
													}

												} else {	
													if ( fs.existsSync(output) ) {
														displayProgress(false, false, input, output, fileName)
														i++
														generateColorIconsSmall(i)
													} else {
														setTimeout(() => {
															generateColorIconsSmall(i)
														}, 50)
													}
												}
											}, 50)
										})
										.pipe(fs.createWriteStream(output))
								
								} else {
									k++
									transformFiles(k)
								}
							}
							generateColorIconsSmall(0)

						} else {
							fs.createReadStream(input)
								.pipe(zlib.Gzip())
								.on('end', function() {
									if ( fs.existsSync(output + 'z') ) {
										displayProgress(k, keepListLen, input, output + 'z', fileName + 'z')
										k++
										transformFiles(k)
									} else {
										setTimeout(() => {
											transformFiles(k)
										}, 50)
									}
								})
								.pipe(fs.createWriteStream(output + 'z'))
						}

					} else {
						// (?)
					}

				} else {
					fs.createReadStream(input)
						.on('end', function() {
							if ( fs.existsSync(output) ) {
								displayProgress(k, keepListLen, input, output, fileName)
								k++
								transformFiles(k)
							} else {
								setTimeout(() => {
									transformFiles(k)
								}, 50)
							}
						})
						.pipe(fs.createWriteStream(output))
				}

			} else {
				displayInfo('Simon says', 'compression finished', {
					color: 'green',
					status: 'end'
				})
				
				// reset await
				timeoutHandle = false;
				_await = false;
			}
		}

		// when nothing to delete, run compress
		// else start it after deleting
		if (delListLen === 0 && keepListLen > 0) {
			displayInfo('', 'compression start (' + keepListLen + ' files)')
			transformFiles(0);
		}
		
		var deleteFiles = (d) => {
			if (d < delListLen) {
				let fileName = delList[d].fileName,
					path = delList[d].path,
					dist = delList[d].dist,
					input = delList[d].input,
					output = delList[d].output,
					extName = delList[d].extName;

				if (extName === 'svg') {
					output = output + 'z'
				}

				rimraf(output, function() { // should delete old output (and blank dir or with one file index.html(0b) )
					displayDeleted(input);

					let deteleFontExtensions = (df) => {
						if (df < fontsExtensionsLen) {
	
							let ffName = fileName.split('.') // file first name, without ext
							ffName.pop()
							ffName = ffName.join('.')
							ffName = ffName + '.' + fontsExtensions[df]
							
							let delFont = dist + ffName
	
							if (fs.existsSync(delFont)) {
								rimraf(delFont, function() { // should delete old output (and blank dir or with one file index.html(0b) )
									// displayDeleted(input);
								
									df++
									deteleFontExtensions(df)
								})
							} else {
								df++
								deteleFontExtensions(df)
							}
						} else {
							d++
							deleteFiles(d)
						}
					}
	
					let deleteSizedFiles = (ds) => {
						if (ds < sizingLen) {
	
							let	sizeName;
	
							sizing[ds].name.length > 0 ? sizeName = '_' + sizing[ds].name : sizeName = '';
	
							let ffName = fileName.split('.') // file first name, without ext
							ffName.pop()
							ffName = ffName.join('.')
							ffName = ffName + sizeName + '.' + extName
							
							let delSizingOutput = dist + ffName
	
							if (fs.existsSync(delSizingOutput)) {
								rimraf(delSizingOutput, function() { // should delete old output (and blank dir or with one file index.html(0b) )
									// displayDeleted(input);
								
									ds++
									deleteSizedFiles(ds)
								})
							} else {
								ds++
								deleteSizedFiles(ds)
							}
						} else {
							d++
							deleteFiles(d)
						}
					}

					let deteleVariousColorIcons = (di) => {
						if (
							di < svgOptionsLen
							&& 	fileName.indexOf('ico_setColor_') > -1
						) {

							let delOptionOutput = dist + fileName.replace(/_setColor/, '_' + svgOptions[di].colorName) + 'z';

							if (fs.existsSync(delOptionOutput)) {
								rimraf(delOptionOutput, function() {

									if (fs.existsSync(jsonDist + 'all_icons.json')) {
															
										let allIcons;
									
										let time_now = new Date();
										fs.readFile(jsonDist + 'all_icons.json', 'utf8', (err, data) => {
											
											if ( 	data.substr(0,1) === '[' 
												&& 	data.substr(data.length - 1, 1)  === ']' ) {

												allIcons = JSON.parse(data);
											
												for (let z = 0; z < allIcons.length; z++) {
						////////////////////////////////////////////////////////////////////////////////////// make ===
													if ( delOptionOutput.indexOf(allIcons[z].src) > -1 ) {
														allIcons.splice(z, 1);
													}
												}	

												fs.writeFile(jsonDist + 'all_icons.json', JSON.stringify(allIcons), (cb) => {
													
													if (di	 === svgOptionsLen - 1) 
													generateLog(instanceName, 'json', 'all_icons.json', jsonDist + 'all_icons.json', new Date() - time_now)
	
													di++
													deteleVariousColorIcons(di)
												})
											} else {
												di++
												deteleVariousColorIcons(di)
											}
										});
										
									} else {
										di++
										deteleVariousColorIcons(di)
									}

								})
							} else {
								di++
								deteleVariousColorIcons(di)
							}
						} else if (
							di < svgOptionsLen
							&& 	fileName.indexOf('i_setColor_') > -1
						) {

							let delOptionOutput = dist + fileName.replace(/_setColor/, '_' + svgOptions[di].colorName) + 'z';

							if (fs.existsSync(delOptionOutput)) {
								rimraf(delOptionOutput, function() {
									di++
									deteleVariousColorIcons(di)
								})
							} else {
								di++
								deteleVariousColorIcons(di)
							}

						} else {
							d++
							deleteFiles(d)
						}
					}

					// fire deleteSizedFiles() 
					switch (extName) {
						case 'jpg':
						case 'jpeg':
						case 'jpe':
						case 'png':
						deleteSizedFiles(0)
						break;

						case 'svg':
						deteleVariousColorIcons(0)
						break;

						case 'otf':
						case 'ttf':
						deteleFontExtensions(0)
						break;
				
						default: 
						d++
						deleteFiles(d)
					}

				})

			} else {
				displayInfo('', `deleting finished (${delListLen} files)`, {
					color: 'green',
					status: 'end'
				})

				keepListLen == 0 ? _await = false : _await = true; // reset if no files to keep
				if (keepListLen > 0) {
					displayInfo('', 'compression start (' + keepListLen + ' files)')
					transformFiles(0);
				}
			}
		}
		if (delListLen > 0) {
			displayInfo('', 'deleting start')
			deleteFiles(0);
		}

	}, 1000	) // change to requestAnimationFrame once second new Date() difference

}

const generatePaths = (cb) => {
	console.log(cb.history)
	console.log(cb.cwd)
	console.log(cb.base)
	console.log(cb._isVinyl)
	console.log(cb.event)
	let buf, ext;
	let event, path, fileName, extName, treeArr;
	let tree = '', distTree = '';

	event = cb.event

	path = cb.base.substring(cb.cwd.length + 1)
	path.substring(path.length - 1) !== '/' ? path = path + '/' : path = path

	cb.history instanceof Array ? fileName = cb.history[0] : fileName = cb.history
	fileName = fileName.substring(cb.base.length)
	fileName.indexOf('/') == 0 ? fileName = fileName.substring(1) : fileName = fileName

	treeArr = fileName.split('/');
	if (treeArr.length > 1) {
		let arrLen = treeArr.length - 1;
		fileName = treeArr[arrLen]
		
		for (let i = 0; i < arrLen; i++) {

			tree = tree + treeArr[i] + '/'

			if (i > 0) {
				distTree = distTree + treeArr[i] + '/'
			}
		}
	}

	let fileNameArr = fileName.split('.');
	extName = fileNameArr[fileNameArr.length - 1]

	if ( fs.existsSync(path + tree + fileName) ) {
		ext = undefined
		buf = readChunk.sync(path + tree + fileName, 0, 500);
		if (fileType(buf)) ext = fileType(buf).ext
	}
	
	return {
		'event': event,
		'tree': tree,
		'distTree': distTree,
		'path': path,
		'fileName': fileName,
		'extName': extName,
		'ext': ext
	}
}

const watchProject = (__settings, _i) => {

	let	_s = __settings[_i];

	if (_i < __settings.length) {

		switch (process.argv[2]) {
			case _s.instanceName:
			case _s.instanceNameShort:

				if (_s.proxy) {
					gulp.src(__dirname)
					.pipe(
						webserver({
							host: process.env.host || 'localhost',
							port: process.env.port || 8080,
							open: true,
							livereload: {
								enable: true
							},
							directoryListing: {
								enable: true,
								path: __dirname
							},
							proxies: _s.proxy
						})
					)
				}

				console.log('[' + timeNow().dim + ']' + ' ... ' + 'watching'.cyan + ' ... ' + _s.instanceName)

				watch(
					_s.watch,
					function(cb) {

						watchAssets({
							"settings":	_s,
							"args":		generatePaths(cb)
						})

					}
				)
				break;

			default:
				_i++
				watchProject(__settings, _i);
		}
	} else {
		if (process.argv[2] !== undefined) {
			console.log('[' + timeNow().dim + '] ' + process.argv[2] + ' not found'.red)
		} else {
			console.log('[' + timeNow().dim + '] ' + 'project name is required (node watch projectName)'.red)
		}
	}
}
watchProject( settingProjects(), 0 );