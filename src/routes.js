const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const { OpenApiValidator } = require('express-openapi-validate');

const { Router } = require('express');
const { User } = require('./models');

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync(path.resolve(__dirname, 'openapi.yaml'), 'utf-8')
);

const validator = new OpenApiValidator(openApiDocument);

const routerUser = Router();

routerUser.get(
  '/:id',
  validator.validate('get', '/user/{id}'),
  async (req, res) => {
    const user = await User.get(req.params.id);
    res.json(user);
  }
);

module.exports = {
  user: routerUser
};
