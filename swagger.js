const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Board API',
      version: '1.0.0',
      description: 'API documentation for Job Board application',
    },
    servers: [{ url: 'http://113.198.66.75:17233' }],
  },
  apis: [path.join(__dirname, './swagger/swagger.yaml')], // swagger.yaml 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
