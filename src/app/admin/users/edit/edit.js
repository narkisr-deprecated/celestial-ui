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
.controller( 'UserEditCtrl', function UserEditController($scope, $resource, $location, growl,rolesService) {

  var Users = $resource('/users/:name',{name:'@name'},{
    update: {method : "PUT",url:'/users/'}
  }); 

  $scope.username = $location.path().replace("/admin/user/edit/","");


  $scope.loadUser = function(roles){
    Users.get({name:$scope.username}, function(data){
      data.password = '';
	data.roles = _.invert(roles)[data.roles];
      $scope.user = data;
      $scope.roleKeys = _.keys(roles);
      if($scope.user.envs !== undefined){
        $scope.user.envs = $scope.user.envs.join(" ");
      }     
    });
  };


  rolesService.loadRoles($scope.loadUser);

  $scope.submit = function(){
    user = $scope.user;
    if(user.envs!== ""){ 
	user.envs= user.envs.split(" ");
    }
    user.roles = [user.roles];
    Users.update(user,
      function(resp) {
        $location.path( '/admin/users');
      },function(errors){
        growl.addErrorMessage(errors.data);
      }
     );
  };

  $scope.remove = function(){
    Users.remove({name:$scope.username},
      function(resp) {
        growl.addInfoMessage('User deleted');
        $location.path( '/admin/users');
      },function(errors){
        growl.addErrorMessage(errors.data);
      }
     );
  }; 
  
});
