var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'src', 'index.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {

    // Makes sure errors in console map to the correct file
    // and line number
    devtool: 'eval',
    entry: [
        // For hot style updates
        'webpack/hot/dev-server',
        'bootstrap-loader',
        // The script refreshing the browser on none hot updates
      //  'webpack-dev-server/client?http://localhost:8080',
        // Our application
        mainPath],
        //'./src'],
    output: {
        // We need to give Webpack a path. It does not actually need it,
        // because files are kept in memory in webpack-dev-server, but an
        // error will occur if nothing is specified. We use the buildPath
        // as that points to where the files will eventually be bundled
        // in production
        path: buildPath,
        filename: 'bundle.js',

        // Everything related to Webpack should go through a build path,
        // localhost:3000/build. That makes proxying easier to handle
        publicPath: '/build/'
    },
    module:  {
        loaders: [
            {
                test:/\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:{
                    presets:['es2015']
                }
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style',
                    'css',
                    'sass'
                ]
            },
            { test: /\.xml$/, loader: 'xml-loader' },
            //{ test: /\.css$/, loader: 'style-loader!css-loader' },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|svg|eot|ttf)$/,
                loader: 'file'
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                //JSON LOADER
                test: /\.json$/,
                loader: "json-loader"
            },
            // handlebar template loader
            {
                test: /\.handlebars$/,
                loader: "handlebars-loader"
            },
            {
                test: /bootstrap-sass\/assets\/javascripts\//,
                loader: 'imports?jQuery=jquery'
            },
            {
                test: /\.css$/,
                loader: 'style!css?sourceMap'
            }
        ]
    },

    // We have to manually add the Hot Replacement plugin when running
    // from Node
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;