const { Router } = require('express');

const index = Router().get('/', (req, res) => {
  res.json({ hello: 'world' });
});

module.exports = {
  index
};
