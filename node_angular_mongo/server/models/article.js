var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = require('../helpers/db');

autoIncrement.initialize(connection);

var articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  image: {
    type: String
  },
  tags: {
    type: Array
  }
});

articleSchema.plugin(autoIncrement.plugin, 'Article');

module.exports = mongoose.model('Article', articleSchema);