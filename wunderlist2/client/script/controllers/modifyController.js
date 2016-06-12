angular.module('wunderlist')
	.controller('modifyController', [
		'$scope',
		'tasksService',
		'$stateParams',
		'popupService',
		'Upload',
		'$timeout',
		'sessionService',
		function($scope, tasksService, $stateParams, popupService, Upload, $timeout, sessionService){

			var scope = $scope;
			var $taskModify = $('.task-modify');
			var $chatWindow = $('.chat-window-wrap');
			$taskModify.addClass('show');

			socket.on('subtaskChanged', function(data) {
				if ($stateParams.taskId === data.taskId && $stateParams.id === data.listId) {
					if (data.message === 'new') {
						scope.draft.subtasks.unshift(data.subtask);
						$scope.$apply();
					} else if (data.message === 'delete') {
						for(var i = 0; i < scope.draft.subtasks.length; i++) {
							if (scope.draft.subtasks[i].name === data.subtask.name) {
								scope.draft.subtasks.splice(i, 1);
								return;
							}
						}
					} else if (data.message === 'complete') {
						var taskIncompleted;
						for(var i = 0; i < scope.draft.subtasks.length; i++) {
							if (scope.draft.subtasks[i].name === data.subtask.name || data.all) {
								scope.draft.subtasks[i].completed = true;
							}
						}
						if (data.all) {
							scope.draft.disabled = true;
						}
						if (data.taskCompleted && !data.all) {
							scope.completeTask(null, scope.editingTask);
						}
					} else if (data.message === 'newImage') {
						scope.draft.images.push(data.img);
					} else if (data.message = 'newMessage') {
						console.log(data.author);
						scope.draft.messages.push({message: data.messageText, author: data.author});
					}
				}
			})
			scope.editingTask = $stateParams.taskObject;
			scope.draft = angular.copy(scope.editingTask);
			var originalName = scope.draft.name;
			var originalDescription = scope.draft.description;
			scope.data = {};

			scope.completeSubtask = function(subtask) {
				tasksService.completeSubtask($stateParams.taskId, subtask)
				.success(function(response) {
					socket.emit('subtaskChange', {
						message: 'complete',
						listId: $stateParams.id,
						taskId: $stateParams.taskId,
						subtask: subtask,
						taskCompleted: response.taskCompleted
					});
				})
				.error(function(error) {
					console.log(error);
				})
			}

			scope.deleteSubtask = function(subtask) {
				tasksService.deleteSubtask($stateParams.taskId, subtask)
				.success(function(response) {
					socket.emit('subtaskChange', {
						message: 'delete',
						listId: $stateParams.id,
						taskId: $stateParams.taskId,
						subtask: subtask
					});
				})
				.error(function(error) {
					console.log(error);
				})
			}

			$scope.closeModifyWindow = function() {
				$taskModify.addClass('hide');
				$scope.hideChat();
				scope.data.temporarySubtask = '';
			};

			scope.addToSubtasks = function(event, task) {
				if (!task) return;
				if (event.keyCode === 13) {
					var inSubTasks = scope.draft.subtasks.some(function(subtask) {
						return subtask.name == task;
					});
					scope.data.temporarySubtask = '';
					if (inSubTasks) return;
					tasksService.createSubtask(scope.editingTask.taskId, {name: task, completed: false})
						.success(function(response) {
							socket.emit('subtaskChange', {
								message: 'new',
								listId: $stateParams.id,
								taskId: $stateParams.taskId,
								subtask: {
									name: task,
									completed: false
								}
							});
						})
				}
			};
			scope.updateDescription = function(description) {
				if (!description || description === originalDescription) {
					scope.draft.description = originalDescription;
					return;
				}
				tasksService.updateTaskDescription({description: description}, $stateParams.taskId)
					.success(function(response) {
						originalDescription = description;
						socket.emit('taskChange', {listId: $stateParams.id, message: 'updateDescription', description: description, taskId: $stateParams.taskId});
					})
					.error(function(err) {
						console.log(err);
					})
			};

			scope.updateTaskName = function(name) {
				if (!name || name === originalName) {
					scope.draft.name = originalName;
					return;
				}
				tasksService.updateTaskName({name: name}, $stateParams.taskId)
					.success(function(response) {
						originalName = name;
						socket.emit('taskChange', {listId: $stateParams.id, message: 'updateName', name: name, taskId: $stateParams.taskId});
					})
					.error(function(err) {
						console.log(err);
					})
			};
			scope.deleteTask = function($event) {
				scope.taskController.deleteTask($event, scope.editingTask);
			};

			$scope.$watch('files', function (newValue) {
		        $scope.upload($scope.files);
		    });

		    $scope.addToMessages = function(event, newMessage) {
		    	if (!newMessage) return;
				if (event.keyCode === 13) {
					$scope.data.newMessage = '';
					tasksService.addnewMessage({message: newMessage, author: sessionService.currentUser.email}, $stateParams.taskId)
					.success(function(response) {
						socket.emit('subtaskChange', {listId: $stateParams.id, message: 'newMessage', messageText: newMessage, author: sessionService.currentUser.email, taskId: $stateParams.taskId});
					})
					.error(function(err) {
						console.log(err);
					})
				}
		    };
		    $scope.hideChat = function() {
		    	$chatWindow.removeClass('show-chat');
		    };
		    $scope.showChat = function() {
		    	$chatWindow.addClass('show-chat');
		    };

		    $scope.upload = function (files) {
		    	if (files && files.length) {
		        	for (var i = 0; i < files.length; i++) {
			          	var file = files[i];
			          	if (!file.$error) {
					        Upload.upload({
							  	url: 'api/upload',
							  	method: 'POST',
							  	data: {taskId: $stateParams.taskId},
							  	file: file
							}).success(function(response) {
								socket.emit('subtaskChange', {
									message: 'newImage',
									listId: $stateParams.id,
									taskId: $stateParams.taskId,
									img: response
								});
							})
			    		};

					}
				}
			};
		}
	]);