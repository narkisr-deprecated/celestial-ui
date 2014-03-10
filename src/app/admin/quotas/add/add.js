angular.module( 'celestial.quotaAdd', [ ])
.config(function config($stateProvider) {
  $stateProvider.state( 'quotaAdd', {
    url: '/admin/quota/add/',
    views: {
	"main": {
        controller: 'QuotaAddCtrl',
        templateUrl: 'admin/quotas/add/add.tpl.html'
      }
    },
    data:{ pageTitle: 'New Quota' }
  });
})
.controller( 'QuotaAddCtrl', function UserAddController($scope, $resource, $location, growl, envsService, usersService) {

  var Users = $resource('/quota/',{});
  
  $scope.user= {};

  $scope.submit = function(){
  };

  usersService.grabUsers().then(function(users){
    $scope.users = users;
    $scope.user = $scope.users[0];
  });
 
  $scope.setHypervisors = function() {
    if($scope.env !== undefined){
      $scope.hypervisors = _.keys($scope.rawEnvs[$scope.env]); 
      $scope.currentHypervisor = $scope.hypervisors[0];
    }
  };

  $scope.setEnvs = function() {
    if($scope.user!== undefined){
      $scope.envs = $scope.user.envs;
	$scope.env = $scope.user.envs[0];
    }
  };

  $scope.submit = function(){
    Quotas.save($scope.user,
      function(resp) {
        $location.path( '/admin/users');
      },loggingService.error);
  };

  $scope.$watch('env', $scope.setHypervisors);
  $scope.$watch('user', $scope.setEnvs);
  envsService.loadEnvs($scope);
});
