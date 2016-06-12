var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
	name: String, 
	completed: Boolean,
	list_id: String,
	subtasks: Array,
	description: String,
	images: Array,
	messages: Array
});

taskSchema.methods.saveTask = function(options){
	this.name = options.name;
	this.completed = options.completed || false;
	this.list_id = options.list_id;
	this.images = [];
	this.messages = [];
	this.save();
};



module.exports = mongoose.model('Task', taskSchema);