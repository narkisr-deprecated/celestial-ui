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

  rolesService.loadRoles($scope);

  $scope.loadUser =function(){
    Users.get({name:$scope.username}, function(data){
      data.password = '';
	data.roles = _.invert($scope.roles)[data.roles];
      $scope.user = data;
    });
  };

  $scope.loadUser();

  $scope.submit = function(){
    Users.update($scope.user,
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
