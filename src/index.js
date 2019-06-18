/* eslint-disable no-console */
const fs = require('fs');
const http = require('http');
const express = require('express');
const serverless = require('serverless-http');
const jsYaml = require('js-yaml');
const { OpenApiValidator } = require('express-openapi-validate');
const routes = require('./routes');

const app = express();

app.disable('x-powered-by');
app.set('etag', false);

app.use(express.json());
app.use(routes.index);

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync('openapi.yaml', 'utf-8')
);

const validator = new OpenApiValidator(openApiDocument);

app.post('/echo', validator.validate('post', '/echo'), (req, res) => {
  res.json({ output: req.body.input });
});

app.use((req, res) => {
  res.status(404).json();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = { error: {} };

  if (statusCode === 500) {
    response.error.name = 'Internal Server Error';
  } else if (err.name === 'ValidationError') {
    response.error = {
      name: err.name,
      message: err.message,
      data: err.data
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    response.error.stackTrace = err.stack;
  }

  res.status(statusCode).json(response);
});

if (require.main === module) {
  const server = http.createServer(app);
  server
    .listen(3000)
    .on('listening', () => {
      console.log(
        `Listening on ${server.address().address}:${server.address().port}`
      );
    })
    .on('error', error => {
      console.error({ error }, 'Cannot start http server');
      throw error;
    });
} else {
  module.exports = {
    app,
    handler: serverless(app)
  };
}
