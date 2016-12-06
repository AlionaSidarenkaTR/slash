var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
	entry: [
	  APP_DIR + '/index.tsx' // Your appʼs entry point
	],
	devtool: "source-map",
	output: {
		path: BUILD_DIR,
		publicPath: "http://localhost:3000/public",
		filename: 'bundle.js'
	},
	resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
	module : {
			loaders: [{
				test: /\.tsx?$/,
				loaders: ['react-hot', 'babel', 'ts-loader'],
				include: APP_DIR
			}],

        preLoaders: [
        {
            test: /\.tsx?$/,
            exclude: /(node_modules)/,
            loader: 'source-map'
        }
      ],
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