angular.module( 'celestial.userEdit', [ ])
.config(function config($stateProvider) {
  $stateProvider.state( 'userEdit', {
    url: '/admin/user/edit/:name',
    views: {
	"main": {
        controller: 'UserEditCtrl',
        templateUrl: 'admin/users/edit/edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit User' }
  });
})
.controller( 'UserEditCtrl', function UserEditController($scope, $resource, $location, growl, rolesService, loggingService, usersService, envsService) {

  var Users = $resource('/users/:name',{name:'@name'},{
    update: {method : "PUT",url:'/users/'}
  }); 

  $scope.username = $location.path().replace("/admin/user/edit/","");


  $scope.loadUser = function(roles){
    Users.get({name:$scope.username}, function(data){
      data.password = '';
	data.roles = _.invert(roles)[data.roles];
      usersService.operations().then(function(data) {
         $scope.operations = data.operations;
      });
      $scope.user = data;
      $scope.roleKeys = _.keys(roles);
    });
  };


  envsService.loadEnvKeys().then(function(data){
     $scope.envs = data.environments;
  }); 

  rolesService.loadRoles($scope.loadUser);

  $scope.submit = function(){
    user = $scope.user;
    user.roles = [user.roles];
    if(user.password === ""){
      delete user.password;
    }
    Users.update(user,
      function(resp) {
        $location.path( '/admin/users');
      },loggingService.error);
  };

  $scope.remove = function(){
    Users.remove({name:$scope.username},
      function(resp) {
        growl.addInfoMessage('User deleted');
        $location.path( '/admin/users');
      },loggingService.error);
  }; 
});
