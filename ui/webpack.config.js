if (process.env.NODE_ENV === 'production') {
    console.log("> Config is: 'webpack.config.prod.js'");
    module.exports = require('./webpack.config.prod')
} else {
    console.log("> Config is: 'webpack.config.dev.js'");
    module.exports = require('./webpack.config.dev')
}