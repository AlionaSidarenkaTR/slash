angular.module('wunderlist')
	.controller('taskController', [
		'$scope', 
		'tasksService',
		'$stateParams',
		'popupService',
		function($scope, tasksService, $stateParams, popupService){
			var me = this;
			$(function () {
               /* $('#d3').datetimepicker();
                $("#d3").on("dp.change", function (e) {
		            $('#d3').data("DateTimePicker").minDate(new Date());
		        });*/
                $('#add-task').on('keydown', function(e) {
                	if (e.keyCode === 13) {
                		$scope.createTask($scope.name);
                		$scope.name = '';
                	}
                })
            });

            $scope.showModifyWindow = function(task) {
            	me.editingTask = task;
            	$('.task-modify').removeClass('hide').addClass('show');
            };

            this.editingList = tasksService.getList();
			function getTasks() {
				tasksService.getTasks()
				.success(function(response){
					var array = response.map(function(item){return item.name})
					$scope.tasks = response.reverse();
				})
				.error(function(error){
					$scope.tasks = [{name: 'no-task-error'}];
				});
			}
			getTasks();
			socket.on('taskChanged', function(data) {
				if ($stateParams.id === data.listId) {
					getTasks();
					if (me.editingTask && me.editingTask._id === data.taskId) {
						if (data.message === 'updateName') {
							me.editingTask.name = data.name;
						}
						if(data.message === 'updateDescription') {
							me.editingTask.description = data.description;
						}
						if (data.message === 'closeModifyWindow') {
							$('.task-modify').addClass('hide');
						}
					};
				}
			});

			$scope.createTask = function(name) {
				tasksService.createTask(name)
				.success(function(response){
					socket.emit('taskChange', {listId: $stateParams.id});
				})
				.error(function(error){
					console.log(error);
				});
			};
			$scope.completeTask = function($event, task, data){
				$event && $event.stopPropagation();
				tasksService.completeTask(task._id, data)
				.success(function(response){
					socket.emit('subtaskChange', {
						message: 'complete', 
						listId: $stateParams.id, 
						subtask: {},
						all: true,
						taskId: task._id,
						all:true,
						taskCompleted: true
					});
					if (me.editingTask && task._id === me.editingTask._id) {
						me.editingTask.completed = true;
					}

				})
				.error(function(error){
					console.log(error);
				});
			};

			$scope.showTaskPopup = function() {
				popupService.showTaskPopup();
			};

			$scope.showCompleted = function() {
				$('.completed').addClass('show-completed');
			};

			this.deleteTask = function(event, task) {
				event.stopPropagation();
				tasksService.deleteTask(task)
				.success(function(response) {
					socket.emit('taskChange', {listId: $stateParams.id, taskId: task._id, message: 'closeModifyWindow'});
				})
				.error(function(error) {
					console.log(error);
				})
			}
		}
	]);