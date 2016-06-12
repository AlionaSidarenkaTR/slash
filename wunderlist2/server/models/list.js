var mongoose = require('mongoose');

var listSchema = mongoose.Schema({
	name: String,
	owner_id: String,
	owner_name: String,
	min_time: Number,
	shared: Array, // users that have the ability to manage list [{id: _id, email: email}]
	wait_accept: Array // users that we waiting accept from [{id: _id, email: email}]
});

listSchema.methods.saveList = function(options){
	this.name = options.name;
	this.owner_id = options.owner_id;
	this.owner_name = options.owner_name;
	this.shared = [{userId: options.owner_id, userEmail: options.owner_email}];
	
	if(options.wait_accept) {
		this.wait_accept = options.wait_accept
	}
	this.save();
};

module.exports = mongoose.model('List', listSchema);