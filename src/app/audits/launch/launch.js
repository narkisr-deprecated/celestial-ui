angular.module( 'celestial.auditLaunch', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'auditLaunch', {
    url: '/audits/launch/:name',
    views: {
     'main': {
        controller: 'auditLaunchCtrl',
        templateUrl: 'audits/launch/launch.tpl.html'
	}
    },
    data:{ pageTitle: 'Launch audit' }
  });
})
.controller( 'auditLaunchCtrl', function auditLaunchController($scope, $location, runService,
          $resource, auditsService, $window) {

  $scope.name= $location.path().replace('/audits/launch/','');
  $scope.userArgs= {};
    
   $scope.loadAudit = function(){
     auditsService.get($scope.name).$promise.then(function(res) {
      $scope.audit = res;
     });
   };

   $scope.loadAudit();

   $scope.submit = function(){
     auditsService.linkFor($scope.name, $scope.userArgs).$promise.then(function(link) {
      $scope.link = link;
     });
   };
  
  $scope.openLink = function() {
   if($scope.link !== undefined) {
     $window.open($scope.link);
   }
  };

  $scope.$watch('link', $scope.openLink);

});
