const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
// const extractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	context: __dirname + '/app',
	devtool: debug
		? "inline-sourcemap"
		: null,
	entry: './src/js/calc.js',
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: [
						'react', 'es2015', 'stage-0'
					],
					// plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-leacy']
					plugins: ['react-html-attrs', 'transform-class-properties']
				}
			}
		]
	},
	output: {
		path: __dirname + '/app',
		filename: './dist/app.js'
	},
	plugins: debug
		? []
		: [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.OccurenceOrderPlugin(),
			new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})
		],
	node: {
		fs: "empty"
	}
};

// module.exports = {
// 	context: __dirname + '/app',
// 	entry: './src/less/_base_structure.less',
//     module: {
//         rules: [{
//             test: /\.less$/,
//             use: [
// 			// {
//             //     loader: "style-loader" // creates style nodes from JS strings
//             // }, {
//             //     loader: "css-loader" // translates CSS into CommonJS
//             // },
// 			{
//                 loader: "less-loader" // compiles Less to CSS
//             }
// 			]
//         }]
//     },
// 	output: {
// 		path: __dirname + '/app',
// 		filename: './dist/css/style.css'
// 	}
// };
