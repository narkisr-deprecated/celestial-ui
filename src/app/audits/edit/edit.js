angular.module( 'celestial.auditEdit', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'auditEdit', {
    url: '/audit/edit/:name',
    views: {
	"main": {
        controller: 'AuditEditCtrl',
        templateUrl: 'audits/edit/edit.tpl.html'
       }
    },
    data:{ pageTitle: 'Edit audit' }
  });
})
.controller( 'AuditEditCtrl', function auditEditController($scope, $location, auditsService) {

  $scope.name = $location.path().replace("/audit/edit/","");

  $scope.loadAudit = function(){
    auditsService.get($scope.name).$promise.then(function(res) {
      $scope.audit = res;
    });
  };

  $scope.loadAudit();

  $scope.submit = function(){
    auditService.update($scope.audit);
  };

  $scope.remove = function() {
    auditService.remove($scope.name);
  };
  
});
