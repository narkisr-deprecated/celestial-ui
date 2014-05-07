angular.module( 'celestial.userAdd', [ ])
.config(function config($stateProvider) {
  $stateProvider.state( 'userAdd', {
    url: '/admin/user/add/',
    views: {
	"main": {
        controller: 'UserAddCtrl',
        templateUrl: 'admin/users/add/add.tpl.html'
      }
    },
    data:{ pageTitle: 'New User' }
  });
})
.controller( 'UserAddCtrl', function UserAddController($scope, $resource, $location, growl, rolesService, loggingService, usersService, envsService) {

  var Users = $resource('/users/',{});
  
  $scope.user= {};

  rolesService.loadRoles(function(roles){
    $scope.roleKeys = _.keys(roles);
  });

  usersService.operations().then(function(data) {
    $scope.operations = data.operations;
  });
 
  envsService.loadEnvKeys().then(function(data){
     $scope.envs = data.environments;
  }); 

  $scope.roleDefault = function() {
    if($scope.roleKeys!==undefined){
      $scope.user.roles =  $scope.roleKeys[0];
    }
  };

  $scope.$watch('roleKeys', $scope.roleDefault);

  $scope.submit = function(){
    user = $scope.user;
    user.roles = [user.roles];
    Users.save($scope.user,
      function(resp) {
        $location.path( '/admin/users');
      },loggingService.error);
  };
  
});
