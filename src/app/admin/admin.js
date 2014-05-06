angular.module( 'celestial.admin', [
   'celestial.users', 'celestial.quotas'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'admin', {
    url: '/admin',
    views: {
	"main": {
        controller: 'AdminCtrl',
        templateUrl: 'admin/admin.tpl.html'
	}
    },
    data:{ pageTitle: 'Admin' }
  });
})
.factory('usersService', function($cookieStore ,$cookies, $location, $resource, $window, $q, loginService) {
   var usersService = {};
   var Users = $resource('/users/',{},{
    getAll: {method : "GET",url:'/users/',isArray:true},
    operations: {method : "GET",url:'/users/operations/'}
   });
   
   usersService.grabUsers = function() {
      return Users.getAll({}).$promise;
   }; 

   usersService.operations = function() {
      return Users.operations({}).$promise;
   }; 

   /*
    loads users to scope if current user is superUser
   */
   usersService.loadUsers = function($scope){
    loginService.grabSession().then(function(data) {
      $scope.isSuper = loginService.isSuper(data);
      $scope.owner = data.username;
      if($scope.isSuper) {
        usersService.grabUsers().then(function(users) {
           $scope.users = _.map(users,function(user){return user.username;});
        });
       }
     });
   };

   return usersService;
})
.controller( 'AdminCtrl', function AdminController($scope, $resource, $http){});

