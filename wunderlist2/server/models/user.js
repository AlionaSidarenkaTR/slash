var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
		email: String,
		password: String,
		name: String,
		id: String,
		token: String
});

userSchema.methods.assignPropertes = function(email, password, name, id, token){
	this.email = email;
	if (password) {
		this.password = this.generateHash(password);
	}
	if (name) {
		this.name = name;
	}
	if (id) {
		this.id = id;
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

module.exports = mongoose.model('User', userSchema);