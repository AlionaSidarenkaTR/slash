var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../helpers/db');

autoIncrement.initialize(connection);

var userSchema = new Schema({
  password: {
    type: String,
    required: false
  },
  email: {
    type: String
  },
  name: {
    type: String,
    required: false
  },
  profileId: {
    type: Number,
    required: false
  },
  token: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: false
  }
});

userSchema.methods.assignPropertes = function(email, password, name, profileId, token){
  this.email = email;
  if (email === 'admin') {
    this.role = 'admin';
  } else {
    this.role = 'user';
  }

  if (password) {
    this.password = this.generateHash(password);
  }
  if (name) {
    this.name = name;
  }
  if (profileId) {
    this.profileId = profileId;
  }
  if (token) {
    this.token = token;
  }
};

userSchema.methods.generateHash = function(password){
  //2^9 goes through the algorythm to make it secure
  //not do it more than 13 as it can become slow
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', userSchema);