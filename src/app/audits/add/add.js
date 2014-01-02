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
.controller( 'AuditAddCtrl', function typeAddController($scope, $http, $resource ,auditsService) {

  $scope.name = '';
  $scope.currentType = 'kibana';
  $scope.audit= {};

  $scope.submit = function(){
    auditsService.save($scope.audit); 
  };
  
});
