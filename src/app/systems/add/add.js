angular.module( 'celestial.systemAdd', [
  'ui.state', 'ui.bootstrap', 'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systemAdd', {
    url: '/system/add/',
    views: {
	"main": {
        controller: 'SystemAddCtrl',
        templateUrl: 'systems/add/add.tpl.html'
       }
    },
    data:{ pageTitle: 'New System' }
  });
})
.controller( 'SystemAddCtrl', function SystemAddController($scope,$resource) {

  $scope.system = {};
  $scope.system.hypervisor = 'Proxmox';

  $scope.hypervisorSelect = function() {
    $scope.hypervisorTemplate = 'systems/add/'+$scope.system.hypervisor.toLowerCase()+'.tpl.html';
  };

  $scope.$watch( 'system.hypervisor', $scope.hypervisorSelect );
});
