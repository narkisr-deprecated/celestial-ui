angular.module('celestial.login', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngCookies'])
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
.factory('loginService', function($cookieStore ,$cookies, $location, $http, $window, $q) {
   var loginService = {};

   loginService.logout = function() {
    $http.post('/logout').success(function(){
      $cookieStore.remove('celestial'); 
      $window.location = "/login";
      loginService.session = null;
    }); 
   };

   loginService.grabSession = function(){
    var d = $q.defer();
    $http.get('/sessions').success(function(data){
	d.resolve(data);
    }); 
    return d.promise;
   };


   loginService.isSuper = function(data){
     return !_.isEmpty(_.intersection(data.roles, ['celestial.roles/super-user', 'celestial.roles/admin']));
   };

   loginService.isAdmin = function(data){
     return _.contains(data.roles, 'celestial.roles/admin');
   };

  return loginService;
})
.controller('LoginCtrl', function LoginController ($scope,$http,$location,loginService) {});
