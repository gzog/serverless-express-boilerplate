/* eslint-disable no-console */
const path = require('path');

if (require.main === module) {
  // eslint-disable-next-line global-require
  require('dotenv').config({
    path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`)
  });
}

const http = require('http');
const express = require('express');
const serverless = require('serverless-http');
const routes = require('./routes');

const app = express();

app.disable('x-powered-by');
app.set('etag', false);

app.use(express.json({ limit: '1kb' }));
app.use('/user', routes.user);

app.use((req, res) => {
  res.status(404).json();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  const response = {
    name: err.name,
    message: err.message,
    data: err.data
  };

  if (statusCode === 500) {
    response.name = 'Internal Server Error';
  }

  if (process.env.NODE_ENV !== 'production') {
    response.stackTrace = err.stack;
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
