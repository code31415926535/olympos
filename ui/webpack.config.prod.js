const webpack = require('webpack');

const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const PUBLIC_PATH = path.join(__dirname, '/public');
const DIST_PATH = path.join(__dirname, '/dist');

const config = {
    entry: SRC_DIR + '/index.js',

    output: {
        path: DIST_PATH,
        filename: 'index.bundle.js',
        publicPath: PUBLIC_PATH,

    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: SRC_DIR,
                loader: 'babel-loader',

                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true,
                warnings: false
            },
            comments: false
        })
    ]
};

module.exports = config;