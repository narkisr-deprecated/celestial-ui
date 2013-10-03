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
.factory('loginService', function($cookieStore ,$cookies, $location, $http,$window) {
  var loginService = {};

  loginService.logout = function() {
    $http.post('/logout').success(function(){
      $cookieStore.remove('celestial'); 
      $window.location = "/login";
    }); 
  };
  
  loginService.checkLoginStatus = function() { 
    cookie = $cookies.celestial;
    if(cookie==null){
       $window.location = "/login";
    }
  };

  return loginService;
})
.controller('LoginCtrl', function LoginController ($scope,$http,$location,loginService) {
  
});
