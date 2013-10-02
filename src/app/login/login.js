angular.module('celestial.login', [])

.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
})
.controller('LoginController', function ($scope, $state,$http,authService) {
  
    $scope.submit = function() {    
      $http.post('/login').success(function() {
        authService.loginConfirmed();   
      });
    };

   
});
