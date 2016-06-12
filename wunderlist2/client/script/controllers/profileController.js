angular.module('wunderlist')
	.controller('profileController', ['$scope', '$state', '$rootScope', '$http', 'sessionService', 'tasksService','popupService', '$timeout','$stateParams', function($scope, $state, $rootScope,$http, sessionService, tasksService, popupService, $timeout, $stateParams){
		$scope.user = sessionService.currentUser;
		var email = $scope.user.email;
		var id = $scope.user._id;
		var needJoinSocket = true;
		var me = this;

		getPending(id);
		getLists(id);

		function joinSockets() {
			var sockets = [];
			$scope.lists.forEach(function(list) {
				sockets.push(list._id);
			});

			sockets.length && socket.emit('joinSockets', {sockets: sockets});
		}
		function getPending(id) {

			tasksService.getPending(id)
				.success(function(response){
					response.forEach(function(wait) {
						wait.wait_accept.forEach(function(invite) {
							if (invite.userId === id) {
								wait.invitor_id = invite.invitor_id;
								wait.invitor_email = invite.invitor_email;
							}
						})
					})
					$scope.pending_invites = response.reverse();
				})
				.error(function(error){
					$scope.pending_invites = [{name: '1'}, {name: '2'}, {name: '3'}];
				});
		}

		function getLists(id) {

			tasksService.getLists(id)
				.success(function(response){
					$scope.lists = response;
					if (needJoinSocket) {
						joinSockets();
						needJoinSocket = false;
					}
				})
				.error(function(error){
					$scope.lists = [{name: 'inbox'}, {name: 'watch film'}, {name: 'read english book'}];
				});
		}


		socket.on('recieveInvitation', function (data) {
           getPending(data.id);
        });

		socket.on('recieveResult', function (data) {
           getLists(id);
        });

		socket.on('sendInvitation', function(data) {
			getLists(id);
			if (data.name && me.listToShowTasks && data.listId === me.listToShowTasks._id) {
				me.listToShowTasks.name = data.name;
			}
			if (data.message === 'deleteList') {
				$state.go('/profile');
			}
		});

		$scope.toApprove = function(listId, ownerId) {
			tasksService.approve(listId, id, email)
				.success(function(response){
					for (var i = 0; i < $scope.pending_invites.length; i++) {
						if($scope.pending_invites[i]._id === listId) {
							var invitor_id = $scope.pending_invites[i].invitor_id;
							var approvedInvite = $scope.pending_invites.splice(i,1);
							$scope.lists.push(approvedInvite[0]);
							socket.emit('result', {message: 'approve', invitor_id: invitor_id, userId: id, listId: listId})
							break;
						}
					}
				})
				.error(function(error){
					console.log('error');
				});
		};
		$scope.decline = function(listId) {
			tasksService.decline(listId, id)
			.success(function(response){
				for (var i = 0; i < $scope.pending_invites.length; i++) {
					if($scope.pending_invites[i]._id === listId) {
						$scope.pending_invites.splice(i,1);
						socket.emit('result', {message: 'decline', userId: id, listId: listId})
						break;
					}
				}
			})
			.error(function(error){
				console.log(error);
			});
		};

		$scope.createNewList = function(data) {
			tasksService.createNewList(angular.extend(data, {owner_id: id, owner_name: $scope.user.name, owner_email: $scope.user.email}))
			.success(function(response){
				$scope.lists.push(response.list);
				popupService.showPopup();
				socket.emit('newList', {listId: response.list._id});
				socket.emit('invited', {invited_users: response.waiting, invitor_id: id});
			})
			.error(function(error){
				$scope.lists = [{name: 'inbox'}, {name: 'watch film'}, {name: 'read english book'}];
			});
			$scope.popShown = false;
		};

		$scope.editList = function(data) {
			angular.extend(data, {invitor_id: id, invitor_email: email});
			tasksService.editList(me.editingList._id, data)
			.success(function(response){
				//response = {name, waiting, listId}
				//response.waiting=[{userId: .., userEmail: ..}, {..}]
				socket.emit('invited', {invited_users: response.waiting, invitor_id: id, listId: response.listId, name: response.name});
				me.editingList = null;
				popupService.showPopup();
				
			})
			.error(function(error){
				console.log(error);
			});
			$scope.popShown = false;
		};
		$scope.deleteList = function(list) {
			tasksService.deleteList(list._id)
			.success(function(response){
			socket.emit('invited', {listId: list._id, message: 'deleteList'});
				//TODO remove tasks when list deleted
				//unjoin room
			})
			.error(function(error){
				console.log(error);
			});
		};

		$scope.addEmail = function(e, form) {
			if (e.keyCode === 13) {
				e.preventDefault();
				e.stopPropagation();

				if(!form.wait.$error.email) {
					var arrayOfMembers;
					var waitAccept = $scope.data.wait_accept;
					if ($scope.state === 'edit') {
						arrayOfMembers = me.editingList.wait_accept.concat(me.editingList.shared, $scope.toSendInvites)
					} else {
						arrayOfMembers = $scope.toSendInvites.concat([email]);
					}
					var inMembers = arrayOfMembers.some(function(item) {
						return item.userEmail === waitAccept || item === waitAccept;
					});

					if(!inMembers) {
						$scope.toSendInvites.push($scope.data.wait_accept);
					}
					$scope.data.wait_accept = '';
				}
				
			}
		};
		me.listToShowTasks = {};
		$scope.setList = function(list) {
			me.listToShowTasks = list;
			tasksService.setList(list);
		};

		function showPopup() {
			return popupService.isPopupShown();
		}

		$scope.$watch(showPopup, function(newValue, oldValue) {
			$scope.popupShown = newValue;
		});

		$scope.showPopup = function(event, state, list) {
			angular.isObject(event) && event.stopPropagation();
			popupService.showPopup(state, list);
			$scope.data = {};
			$scope.state = state;
			$scope.toSendInvites = [];
			$scope.popShown = !$scope.popShown;
			me.editingList = list ? list : null;
			$scope.data.name = (state === 'edit') ?  list.name : '';
		}

		function showTaskPopup() {
			return popupService.isTaskPopupShown();
		}

		$scope.showTaskPopup = function() {
			popupService.showTaskPopup();
		}

		$scope.$watch(showTaskPopup, function(newValue, oldValue) {
			$scope.taskPopupShown = newValue;
		});
	}])
