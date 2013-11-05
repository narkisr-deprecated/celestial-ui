angular.module('celestial.login', ['ui.state', 'ui.bootstrap', 'ngResource', 'ngCookies'])
.config(function ($stateProvider) {
  $stateProvider.state( 'login', {
    url: '/login',
    views: {
      "main": {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.tpl.html'
      }
    },
    data:{ pageTitle: 'Login' }
  });
})
.config(['$httpProvider', function ($httpProvider,$window) {
    $httpProvider.interceptors.push(function ($q) {
        return {
            'response': function (response) {
                return response;
            },
            'responseError': function (rejection) {
                if(rejection.status === 401) {
                    // location.reload();
                   window.location = "/login";
                }
                return $q.reject(rejection);
            }
        };
    });
}])
.factory('loginService', function($cookieStore ,$cookies, $location, $http,$window) {
  var loginService = {};

  loginService.logout = function() {
    $http.post('/logout').success(function(){
      $cookieStore.remove('celestial'); 
      $window.location = "/login";
    }); 
  };
  

   $http.get('/sessions').success(function(data){
      loginService.session = data;
   }); 

   loginService.isSuper = function(call){
    return _.contains(loginService.session.roles,'celestial.roles/super-user');
   };

   loginService.isAdmin = function(call){
    return _.contains(loginService.session.roles,'celestial.roles/admin');
   };

  return loginService;
})
.controller('LoginCtrl', function LoginController ($scope,$http,$location,loginService) {
  
});
