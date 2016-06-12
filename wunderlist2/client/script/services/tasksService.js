angular.module('wunderlist').factory('tasksService', ['$http','$stateParams',  
    function ($http, $stateParams) {
        var that = this;

        return {
            createNewList: function(data) {
                return $http.post('/api/lists/new', data)
            },
            approve: function(listid, id, email) {
               return $http.put('/api/user/approve/' + listid, {userId: id, userEmail: email}); 
            },
            decline: function(listid, id) {
                return $http.put('/api/user/decline/' + listid, {userId: id}); 
            },
            getPending: function(id) {
                return $http.get('/api/user/' + id + '/pending');
            },
            getLists: function(id) {
                return $http.get('/api/user/' + id);
            },
            getTasks: function() {
                return $http.get('/api/lists/' + $stateParams.id);
            },
            createTask: function(name) {
                return $http.post('/api/lists/' + $stateParams.id + '/tasks/new', {name: name});
            },
            completeTask: function(taskId) {
                return $http.put('/api/tasks/' + taskId, {completed: true});
            },
            editList: function(listId, data) {
                return $http.put('/api/lists/' + listId, data);
            },
            deleteList: function(taskId) {
                return $http.delete('/api/lists/' + taskId);
            },
            saveSubtaskChanges: function(data) {
                return $http.put('/api/modify/tasks/' + $stateParams.taskId, data);
            },
            updateTaskName: function(data, taskId) {
                return $http.put('/api/updatename/tasks/' + $stateParams.taskId, data);
            },
            updateTaskDescription: function(data, taskId) {
                return $http.put('/api/updatedescription/tasks/' + $stateParams.taskId, data);
            },
            createSubtask: function(taskId, data) {
                return $http.put('/api/tasks/' + $stateParams.taskId + '/createsubtask', data);
            },
            deleteSubtask: function(taskId, data) {
                return $http.put('/api/tasks/' + taskId + '/deletesubtask', data);
            },
            completeSubtask: function(taskId, data) {
                return $http.put('/api/tasks/' + taskId + '/completesubtask', data);
            },
            upload: function(data) {
                return $http.post('/api/upload', data);
            },
            setList: function(list) {
                that.list = list;
            },
            getList: function() {
                return that.list;
            },
            deleteTask: function(task) {
                return $http.delete('/api/tasks/' + task._id);
            },
            addnewMessage: function(data, taskId) {
                return $http.post('/api/tasks/' + taskId + '/newmessage', data);
            }
        }
    }
]);