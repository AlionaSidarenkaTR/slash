var User = require('../models/user.js');
var List = require('../models/list.js');
var Task = require('../models/task.js');
var multer = require('multer');//to be
var path = require('path');
var fs = require('fs');
var upload = multer({ dest: './uploads/'});
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(router, passport) {
	router.post('/upload', multipartyMiddleware, function(req, res) {
	    var path = req.files.file.path.slice(18);
	    var taskId = req.body.taskId;
	    Task.update({'_id': new ObjectId(taskId)},
			{$addToSet: { 
					'images': path
			   	}
		   	}, function(err, model) {
		   		if(err) {
		        	return res.send(err);
		        }
		        return res.send(path);
			})
	});

	//create new list
	router.post('/lists/new', function(req, res, next) {
		var list = new List();
		var options = req.body;
		var waiting = req.body.wait_accept;
		options.owner_id = new ObjectId(req.body.owner_id);
		User.find({'email': {$in: waiting}}, function(err,users){
			if (!err) {
				var users = users.map(function(user) {
					return {userId: user._id, userEmail: user.email, invitor_id: req.body.owner_id, invitor_email: req.body.owner_email};
				});
				options.wait_accept = users;
				list.saveList(options);
				res.send({list: list, waiting: users});
			} else {
				res.send(err);
			}
		})
	})

	//edit list
	router.put('/lists/:id', function(req, res, next) {
		var id = req.params.id;
		var name = req.body.name;
		var waiting = req.body.wait_accept;
		var invitor_id = req.body.invitor_id;
		var invitor_email = req.body.invitor_email;

		User.find({'email': {$in: waiting}}, function(err,users){
			if (!err) {
				var users = users.map(function(user) {
					return {userId: user._id, userEmail: user.email, invitor_id: invitor_id, invitor_email: invitor_email};
				});
				List.update({'_id': new ObjectId(id)}, {'$set': {
			            name: name
				   	}, $addToSet: { 
				   		wait_accept: {
				   			$each: users
				   		}
				   	}
			   	},
		      	function(err) {
			   		if(err){
			        	return res.send(err);
			        } else {
						res.send({name:name, waiting: users, listId: id})
					}
				})
			}
		})		
	});
	router.get('/user/:id/pending', function(req, res, next) {
		var id = req.params.id;
		List.find({'wait_accept.userId': new ObjectId(id)}, 
			function(err, lists){
				if(err){
					return res.send(err);
				};

				if (!lists.length){
					return res.send([]);
				};

				if (lists){
					return res.send(lists);
				}
		})
	});

	//get the list of lists for the user
	router.get('/user/:id', function(req, res, next) {
		var id = req.params.id;
		List.find({'shared.userId': new ObjectId(id)}, 
			function(err, lists){
				if(err){
					return res.send(err);
				};

				if (!lists.length){
					return res.send([]);
				};

				if (lists){
					return res.send(lists);
				}
		})
	});

	//create new task
	router.post('/lists/:id/tasks/new', function(req, res, next) {
		var task = new Task();
		var name = req.body.name;
		var id = new ObjectId(req.params.id);//doesn't saves as ObjectId, but as String
		task.saveTask({name: name, list_id: id});
		res.send(task);
	});

	//get all tasks for the list
	router.get('/lists/:id', function(req, res, next) {
		var id = req.params.id;
		Task.find({'list_id': new ObjectId(id)}, 
			function(err, tasks) {
				if(err){
					return res.send(err);
				};

				if (!tasks.length){
					return res.send([]);
				};

				if (tasks){
					return res.send(tasks);
				}
			}
		)
	});

	//complete the task
	router.put('/tasks/:id', function(req, res, next) {
		var id = req.params.id;
		var newSubtasks=[];
		Task.find({'_id': new ObjectId(id)}, function(err, doc) {
			doc[0].subtasks.forEach(function(subtask, i) {
				subtask.completed = true;
				newSubtasks.push(subtask);
			})
			Task.update({'_id': new ObjectId(id)},
		      	{'$set': {
			            'completed': true,
			            'subtasks': newSubtasks
			   		}
			   	},
	          	function(err, model) {
			   		if(err){
			        	return res.send(err);
			        } else {
				    	return res.send({completed: true});
					}	
				}
			);
		});
	});

	router.put('/updatename/tasks/:taskId', function(req, res, next) {
		var taskId = req.params.taskId;
		var name = req.body.name;
		Task.update({'_id': new ObjectId(taskId)},
			{'$set': {
	            	'name': name
		   		}
		   	}, function(err, model) {
		   		if(err) {
		        	return res.send(err);
		        }
		        return res.send('success');
			})
	});
	router.put('/updatedescription/tasks/:taskId', function(req, res, next) {
		var taskId = req.params.taskId;
		var description = req.body.description;
		Task.update({'_id': new ObjectId(taskId)},
			{'$set': {
	            	'description': description
		   		}
		   	}, function(err, model) {
		   		if(err) {
		        	return res.send(err);
		        }
		        return res.send('success');
			})
	});

	router.put('/tasks/:taskId/deletesubtask', function(req, res, next) {
		var taskId = req.params.taskId;
		var subtask = req.body;
		Task.update({'_id': new ObjectId(taskId)},
			{$pull: { 
			   		'subtasks': subtask
			   	}
		   	}, function(err, model) {
		   		if(err) {
		        	return res.send(err);
		        }
		        return res.send('success');
			})
	});
	router.put('/tasks/:taskId/completesubtask', function(req, res, next) {
		var taskId = req.params.taskId;
		var name = req.body.name;
		Task.update({'_id': new ObjectId(taskId), "subtasks.name" : name},
			{$set: { 
		   		'subtasks.$.completed': true
				}
			}, function(err, model) {
		   		if(err) {
		        	return res.send(err);
		        }
		        Task.find({'_id': new ObjectId(taskId), "subtasks.completed" : false}, function(err, task) {
		        	if(err) {
			        	return res.send(err);
			        }
			        var taskCompleted = task.length ? false : true;
		        	return res.send({taskCompleted: taskCompleted});
		        })
			})
	});

	router.put('/tasks/:taskId/createsubtask', function(req, res, next) {
		var taskId = req.params.taskId;
		var subtask = req.body;
		Task.update({'_id': new ObjectId(taskId)},
			{$addToSet: { 
			   		'subtasks': subtask
			   	}
		   	}, function(err, model) {
		   		if(err) {
		        	return res.send(err);
		        }
		        return res.send('success');
			})
	});

	router.put('/modify/tasks/:taskId', function(req, res, next) {
		var taskId = req.params.taskId;
		var name = req.body.name;
		var description = req.body.description;
		var created = req.body.actionList.created;
		var completed = req.body.actionList.completed;
		var deleted = req.body.actionList.deleted;

		Task.update({'_id': new ObjectId(taskId)},
			{$pull: { 
				'subtasks': {
					'name': {
							$in: deleted
						}
					}
				}
		   	}, function(err, model) {
		   		if(err) {
		        	return res.send(err);
		        }
		        return res.send(model, 'this');
			})
	})

	//approve list
	router.put('/user/approve/:listid', function(req, res, next) {
		var listId = req.params.listid;
		var userId = req.body.userId;
		var userEmail = req.body.userEmail;

		List.update({'_id': new ObjectId(listId)} , 
			{'$pull': { 
					'wait_accept': {
						'userId': new ObjectId(userId)
					}
				},
				'$addToSet': { 
			   		"shared": {userId: new ObjectId(userId), userEmail: userEmail}
			   	}
			}, function(err) {
		   		if(err){
		        	return res.send(err);
		        } else {
					res.send('success');
				}
			}
		)
	});

	//decline list
	router.put('/user/decline/:listId', function(req, res, next) {
		var listId = req.params.listId;
		var userId = req.body.userId;

		List.update({'_id': new ObjectId(listId)} , 
			{'$pull': { 
					'wait_accept': {
						'userId': new ObjectId(userId)
					}
				}
			}, function(err) {
		   		if(err){
		        	return res.send(err);
		        } else {
					res.send('successfully declined');
				}
			}
		)
	});

	//delete list
	router.delete('/lists/:id', function(req, res, next) {
		var id = req.params.id;
		List.remove({'_id': new ObjectId(id)},
          	function(err, model) {
		   		if(err){
		        	return res.send(err);
		        }
				Task.remove({'list_id': id}, function(err, model) {
					if(err){
			        	return res.send(err);
			        }
		        	return res.send(model);
				})
			}
		);		
	});

	router.post('/tasks/:id/newmessage', function(req, res, next) {
		var messageObject = req.body;
		var taskId = req.params.id;
		Task.update({'_id': new ObjectId(taskId)} , 
			{'$addToSet': { 
			   		"messages": messageObject
			   	}
			}, function(err) {
		   		if(err){
		        	return res.send(err);
		        } else {
					res.send('success');
				}
			}
		)
	});

	router.delete('/tasks/:id', function(req, res, next) {
		var id = req.params.id;
		Task.find({'_id': new ObjectId(id)}, function(err, task) {
			if(err){
	        	return res.send(err);
	        } else {
				function next(err) {
					if (err) return console.error("error in next()", err);
					if (task[0].images.length === 0) return;
					var filename = './client/img/public/' + task[0].images.splice(0,1)[0];
					fs.unlink(filename, next);
				};
				next();
				Task.remove({'_id': new ObjectId(id)},
		          	function(err, model) {
				   		if(err){
				        	return res.send(err);
				        } else {
				        	return res.send(model);
				        }
					}
				);
	        }
			
		})
			
	});	
}