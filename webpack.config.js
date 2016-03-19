var path = require('path');
var colors = require('colors');
var wordwrap = require('wordwrap')

module.exports = {
     devServer: {
        historyApiFallback: true,
        host: "0.0.0.0",
        hot: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
    },
    entry: {
        js: './src/js/app.js',
        html: './index.html'
    },

    output: {
        path: './build',
        publicPath: '/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            // {
            //     test: /\.js$/,
            //     loader: "strip-loader?strip[]=debug,strip[]=console.log"
            // }
        ]
    },
    plugins: []
};
