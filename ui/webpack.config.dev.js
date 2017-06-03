const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');

const config = {
    entry: SRC_DIR + '/index.js',

    output: {
        path: __dirname,
        filename: 'index.bundle.js',
    },

    devServer: {
        inline: true,
        port: 3000
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
    }
}

module.exports = config;