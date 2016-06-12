angular.module('wunderlist')
	.controller('mainController', [
		'$scope', 
		'$http', 
		'$rootScope',
		'$state',
		'sessionService', 
		function(
			$scope, 
			$http, 
			$rootScope,
			$state,
			sessionService){

			var obj = document.createElement('audio');
			obj.setAttribute("src", "../../sounds/1.mp3"); 
        	$.get();

        	$('.button').on('click', function() {
        		obj.play();
        	});

        	$scope.state = $state.current.data.state;
        	$scope.buttonName = ($scope.state === 'login') ? 'Login' : 'SignUp';
			
			this.authorize = function(data){
				var url = '/auth/' + $scope.state;

				$http.post(url, data)
		            .success(function(response){
		                var user = response.user;
						sessionService.authSuccess(user);
		            })
		            .error(function(res){
	                	$scope.message = res.message[0];
	                    sessionService.authFailed();
		            })
			}
	}])
