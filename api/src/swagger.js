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
    apis: ['./route/env.js'],
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
