import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Candidate Referral API',
      version: '1.0.0',
      description: 'API for managing candidate referrals',
    },
    servers: [
      {
        url: 'http://localhost:9999/api',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

fs.writeFileSync('swagger.json', JSON.stringify(specs, null, 2));
console.log('Swagger JSON file generated successfully!');