angular.module('wunderlist').factory('sessionService', ['$cookieStore', 'tasksService', '$document', '$cookies', '$rootScope', '$window', '$http', '$location',  
    function ($cookieStore, tasksService, $document, $cookies, $rootScope, $window, $http, $location) {
    var session = {
        init: function () {
            $(document).ready(function () { 
                $(window).on('beforeunload', function(){
                    socket.close();
                });
            });
            if ($cookieStore.get('loggedIn')){
                var id = $cookieStore.get('userId');
                this.getUser(id);
            } else {
                this.resetSession();
            }
        },
        getUser: function(id) {
            var scope = this;
            $http.get('/auth/id', {
                params: { user_id: id }
            })
            .success(function(response){
                scope.authSuccess(response);
            })
            .error(function(error){
                console.log(error);
                scope.authFailed();
            })
        },
        resetSession: function() {
            this.currentUser = null;
            this.isLoggedIn = false;
            $cookieStore.put('loggedIn', false);
            $cookieStore.remove('userId');
        },
        facebookLogin: function() {
            var url = '/auth/facebook',
                width = 1000,
                height = 650,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            $window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
        },
        googlePlusLogin: function() {
            var url = '/auth/google',
                width = 1000,
                height = 650,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            $window.open(url, 'google_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
        },        
        logout: function() {
            var scope = this;
            $http.delete('/auth/auth').success(function() {
                scope.resetSession();
                $location.path('/');
                $rootScope.$emit('session-changed');
            });
        },
        authSuccess: function(user) {
            $cookieStore.put('userId', user._id);
            $cookieStore.put('loggedIn', true);
            this.currentUser = user;
            this.isLoggedIn = true;

            $location.path('/profile');
            socket.emit('create', {userId: user._id});
        },
        authFailed: function() {
            this.resetSession();
        }
    };
    session.init();
    return session;
}]);