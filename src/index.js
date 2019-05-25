const serverless = require('serverless-http');
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(routes.index);

module.exports.handler = serverless(app);
