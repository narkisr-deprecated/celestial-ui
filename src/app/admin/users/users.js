angular.module( 'celestial.users', [
 'celestial.userAdd', 'celestial.userEdit'
])
.factory('rolesService', function($location, $resource) {
  var rolesService = {};

  var Roles = $resource('/users/',{},{
    get: {method: 'GET', url:'/users/roles'}
  });
  
  rolesService.loadRoles = function(call){
    Roles.get(function(data){
       delete data.roles['anonymous'];
       call(data.roles);
    });
  };

  return rolesService;
 }
)
.config(function config($stateProvider) {
  $stateProvider.state( 'users', {
    url: '/admin/users',
    views: {
	"main": {
        controller: 'UsersCtrl',
        templateUrl: 'admin/users/users.tpl.html'
	}
    },
    data:{ pageTitle: 'Users' }
  });
})
.controller( 'UsersCtrl', function UsersController($scope, $resource, $http, usersService) {
  $scope.perPage = 10;
  $scope.data = {};
   
  $scope.load = function(){
    usersService.grabUsers().then(function(users){
     $scope.data.users= users;
     $scope.currentPage = 1;
     $scope.count = $scope.data.users.length;
    });
  };

  $scope.load();

  $scope.setPage = function () {
    var from = ($scope.currentPage -  1) * $scope.perPage;
    var to = $scope.currentPage  * $scope.perPage;
    if($scope.data.types != null){
        $scope.types = $scope.data.users.slice(from,to);
    }
  };
  
  $scope.$watch( 'currentPage', $scope.setPage );
  $scope.$watch( 'data.users', $scope.setPage );


});

