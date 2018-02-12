var path = require('path');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'src', 'index.js');


var config = {

    // We change to normal source mapping
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src/index.js'),
    //{
    //    path: mainPath,
    //    filename: 'index.js',
    //    publicPath: './src/index.js'
    //
    //},

//'bootstrap-loader',
//        './src',
//           mainPath
//    ],
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extension: ['', '.js', '.scss']
    },
    output: {
        path: path.resolve(__dirname, 'public/build'),
        filename:'bundle.js'
        //path: buildPath,
        //filename: 'bundle.js',
        //publicPath: "/build/"
    },
    module: {
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
    }
};

module.exports = config;
