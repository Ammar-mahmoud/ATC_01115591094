// eslint-disable-next-line import/no-extraneous-dependencies
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zevent API Documentation",
      version: "1.0.0",
      description: "API documentation for the Zevent RESTful service",
    },
    servers: [
      {
        url: "http://localhost:8000/api/v1",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./api/*.js"], // ✅ Adjust to where your route files are
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
