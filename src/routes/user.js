const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const jwtMiddleware = require('express-jwt');
const { OpenApiValidator } = require('express-openapi-validate');

const { Router } = require('express');
const { User } = require('../models');

const openApiDocument = jsYaml.safeLoad(
  fs.readFileSync(path.resolve(__dirname, 'openapi.yaml'), 'utf-8')
);

const validator = new OpenApiValidator(openApiDocument);

const router = Router();

router.get(
  '/get/:id',
  validator.validate('get', '/user/get/{id}'),
  jwtMiddleware({ secret: 'sharedSecret' }),
  async (req, res, next) => {
    const user = await User.get(req.params.id);
    if (!user) {
      next();
    } else {
      res.json(user);
    }
  }
);

router.post(
  '/sign-up',
  validator.validate('post', '/user/sign-up'),
  jwtMiddleware({ secret: 'sharedSecret', credentialsRequired: false }),
  async (req, res) => {}
);

module.exports = router;
