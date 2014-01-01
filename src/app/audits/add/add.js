angular.module( 'celestial.auditAdd', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'auditAdd', {
    url: '/audit/add/',
    views: {
	"main": {
        controller: 'AuditAddCtrl',
        templateUrl: 'audits/add/add.tpl.html'
       }
    },
    data:{ pageTitle: 'New audit' }
  });
})
.controller( 'AuditAddCtrl', function typeAddController($scope, $http, $resource ,auditService) {

  $scope.name = '';
  $scope.currentType = 'kibana';
  $scope.audit= {};

  $scope.typeSelect = function() {
    $scope.provisionerTemplate = 'audit/add/'+$scope.currentType+'.tpl.html';
  };

  $scope.$watch( 'currentType', $scope.typeSelect);

  $scope.submit = function(){
    auditService.save($scope.audit); 
  };
  
});
