var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
	entry: [APP_DIR + '\\main.jsx'],
	output: {
		path: BUILD_DIR,
		publicPath: "http://localhost:3000/",
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
	      $: "jquery",
	      jQuery: "jquery"
	    })
	],
	module: {
		loaders: [
			{
                test: /\.css$/,
                loader: "style!css"
            },
			{
				test: /\.jsx?/,
				include: APP_DIR,
				loaders: ['babel']
			}
		]
	}
};

config.devServer = {
    host: 'localhost',
    port: 3000,
    contentBase: "./",
    hot: true
};
config.entry
    .unshift('webpack-dev-server/client?http://localhost:3000', "webpack/hot/dev-server");

module.exports = config;