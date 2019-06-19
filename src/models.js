const dynamoose = require('dynamoose');

const { Schema } = dynamoose;

const userSchema = new Schema({
  id: String
});

const opts = {
  create: false,
  waitForActive: false
};

const User = dynamoose.model(process.env.DYNAMODB_TABLE, userSchema, opts);

module.exports = {
  User
};
