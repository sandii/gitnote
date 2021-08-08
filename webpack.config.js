const path = require('path');
const webpack = require('webpack');

const DEBUG = process.env.NODE_ENV === 'DEBUG';
console.log(process.env.NODE_ENV || 'BUILDING BEGINS');
const devHost = 'localhost';
const devPort = 3000;

const config = {
	entry : [path.join(__dirname, './public/js/main.js')],
	output : {
		path : path.join(__dirname, './public/js/'),
		filename : '[name]-min.js',
		publicPath : '/public/js/'
	},
	module: {
		loaders: [
		  {
		    test: /\.js$/,
		    exclude: /node_modules/,
		    loader: 'babel-loader',
		    query: {
		      presets: ['react','es2015']
		    }
		  }
		]
	},
	plugins: [
		(DEBUG
			? new webpack.HotModuleReplacementPlugin()
			: new webpack.optimize.UglifyJsPlugin() 
		),		
		new webpack.NoErrorsPlugin()
	],
	devHost,
	devPort
};

module.exports = config;
