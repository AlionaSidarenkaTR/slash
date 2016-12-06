var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
	entry: [
	  APP_DIR + '/index.jsx' // Your appʼs entry point
	],
	output: {
		path: BUILD_DIR,
		publicPath: "http://localhost:3000/public",
		filename: 'bundle.js'
	},
	module : {
			loaders: [{
			test: /\.jsx?$/,
			loaders: ['react-hot', 'jsx?harmony'],
			include: APP_DIR,
			loaders: ['babel']
		}]
	},
	plugins: [
	  new webpack.HotModuleReplacementPlugin()
	]
};

config.devServer = {
    host: 'localhost',
    port: 3000,
    contentBase: path.resolve(__dirname, 'src/client'),
    hot: true
};
config.entry
    .unshift('webpack-dev-server/client?http://localhost:3000/', "webpack/hot/dev-server");

module.exports = config;