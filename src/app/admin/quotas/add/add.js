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
.controller( 'QuotaAddCtrl', function UserAddController($scope, $resource, $location, growl, envsService) {

  var Users = $resource('/quota/',{});
  
  $scope.user= {};

  $scope.submit = function(){
  };
  
  envsService.loadEnvs($scope);
});
