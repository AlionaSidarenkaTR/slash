var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var connection = mongoose.connect(configDB.url);

module.exports = connection;