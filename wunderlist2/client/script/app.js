angular.module('wunderlist', [
	'ui.router',
    'ngRoute',
    'ngCookies',
    'ui.bootstrap',
    'ngResource',
    'ngAnimate',
    'ngFileUpload'
    ]).
    config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){
        $urlRouterProvider.otherwise('/profile');

			$stateProvider
				.state('/header',{
					abstract: true,
					templateUrl: 'views/partials/header.html'
				})
				.state('/',{
					url: '/',
					controller: 'mainController as mainController',
					templateUrl: 'views/partials/home.html',
					parent: '/header',
					data: {
						role: 'unAuth'
					}
				})
				.state('/login',{
					url: '/login',
					templateUrl: 'views/partials/authForm.html',
					controller: 'mainController as mainController',
					parent: '/header',
					data: {
						role: 'unAuth',
						state: 'login'
					}
				})
				.state('/signup',{
					url: '/signup',
					templateUrl: 'views/partials/authForm.html',
					controller: 'mainController as mainController',
					parent: '/header',
					data: {
						role: 'unAuth',
						state: 'signup'
					}
				})
				.state('/profile',{
					url: '/profile',
					templateUrl: 'views/partials/profile.html',
					controller: 'profileController as profileController',
					data: {
						role: 'user'
					}
				})
				.state('listsTasks',{
					url: '/lists/:id',
					templateUrl: 'views/partials/tasks.html',
					controller: 'taskController as taskController',
					data: {
						role: 'user'
					},
					parent:'/profile'
				})
				.state('taskModify',{
					url: '/task/:taskId',
					templateUrl: 'views/partials/taskModify.html',
					controller: 'modifyController as modifyController',
					data: {
						role: 'user'
					},
					params : {taskObject: null},
					parent:'listsTasks'
				})
    }).
	run(['$cookieStore', '$rootScope', '$window', 'sessionService', '$location', '$cookies', function($cookieStore, $rootScope, $window, sessionService, $location, $cookies){
		$rootScope.session = sessionService;
		$window.app = {
			authState: function(state, user) {
	            $rootScope.$apply(function() {
	                switch (state) {
	                    case 'success':
	                        sessionService.authSuccess(user);
	                        break;
	                    case 'failure':
	                        sessionService.authFailed();
	                        break;
	                }

	            });
	        }
		};

	$rootScope.$on('$stateChangeStart', function (event, next) {
	    var authorizedRole = next.data.role;
	    if (authorizedRole === 'user' && !sessionService.isLoggedIn) {
	      	$location.path('/login');
	    }
	    if (authorizedRole === 'unAuth' && sessionService.isLoggedIn) {
	      	$location.path('/profile');
	    }
  	});
}]);

