/* swagger code from: https://github.com/Surnet/swagger-jsdoc/tree/master/example */
var swaggerJSDoc = require('swagger-jsdoc');

/* Configure swagger */
var swaggerDefinition = {
    info: {
        title: 'Olympos Ares API Server',
        version: '1.0.0',
        description: 'Here you can test out the apis provided by Ares server.',
  },
  host: 'localhost:8080',
  basePath: '/',
};

var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./route/auth.js',
        './route/middleware/dataValidator.js',
        './route/user.js',
        './route/env.js',
        './route/test.js'],
};

var swaggerSpec = swaggerJSDoc(options);
var registerSwaggerJSDoc = function (app) {
    app.get("/doc/swagger.json", function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

module.exports = {
    registerSwaggerJSDoc: registerSwaggerJSDoc
}
