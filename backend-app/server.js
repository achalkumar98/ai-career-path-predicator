const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const connectDB = require('./src/config/db');

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());

// Request logging (prints API hits to the backend terminal)
const requestLogger = require('./src/middleware/requestLogger');
app.use(requestLogger);

const apiRoutePrefix = process.env.NODE_ENV === 'production' ? '/api' : '/v1';
const swaggerServerUrl =
  process.env.SWAGGER_SERVER_URL ||
  (process.env.NODE_ENV === 'production'
    ? `https://aicareernav${apiRoutePrefix}`
    : `http://localhost:${process.env.PORT || 5000}${apiRoutePrefix}`);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Career Navigator API',
      version: '1.0.0',
      description: 'REST API documentation for the AI Career Navigator backend',
    },
    servers: [
      {
        url: swaggerServerUrl,
        description: 'API server',
      },
    ],
  },
  apis: ['./src/routes/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(`${apiRoutePrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get(`${apiRoutePrefix}/docs.json`, (req, res) => res.json(swaggerSpec));

// Mount central routes at /v1 in development and /api in production
app.use(apiRoutePrefix, require('./src/routes/v1'));

connectDB();

app.get('/', (req, res) => res.send('API is working'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
