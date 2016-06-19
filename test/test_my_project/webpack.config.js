const path = require('path');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_KEY = '923f3f09b31dceea6dd4dba3f58339ab:7:74953694';
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
    context: path.join(__dirname, '/front_dev/script'),
    entry: {
        preview: ["./PreviewIndex"],
        json: './Json'
    },
    output: {
        path: path.join(__dirname, '/public'),
        publicPath: "http://localhost:3000/",
        filename: "[name].js"
    },
    watch: NODE_ENV === 'development',
    watchOptions: {
        aggregateTimeout: 500
    },
    devtool: NODE_ENV === 'development' ? 'cheap-module-inline-source-map' : null,
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            API_KEY: JSON.stringify(API_KEY)
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [{
                test: /\.less$/,
                loader: "style!css!postcss!less"
            }, {
                test: /\.json$/,
                loader: "json!my-json"
            }, {
                test: /\.jpg$/,
                loader: "url"
            }, {
              test: /\.js$/,
              include: path.join(__dirname, '/front_dev/script'),
              loader: 'babel',
              query: {
                presets: ['es2015'],
                plugins: [
                    ["transform-es2015-classes", {
                      "loose": true
                    }]
                ]
              }
            }
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules', 'custom_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.js']
    }
};

if (NODE_ENV === 'development') {
    module.exports.devServer = {
        host: 'localhost',
        port: 3000,
        contentBase: './public',
        hot: true
    };
    module.exports.entry.preview
        .unshift('webpack-dev-server/client?http://localhost:3000', "webpack/hot/dev-server");
}

if (NODE_ENV === 'production') {
    module.exports.plugins = module.exports.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            compress: {
               warnings: false,
               unsafe: true,
               drop_console: true
            }
        }),
        new StatsPlugin('./stats.json', {
            chunkModules: true,
            exclude: path.resolve(__dirname, "node_modules")
        })
    ]);
}