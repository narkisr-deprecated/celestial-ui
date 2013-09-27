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
.controller( 'SystemAddCtrl', function SystemAddController($scope,$http,$resource,$location) {

  var Systems = $resource('/systems/');
  
  $scope.system = {proxmox:{type:'ct'}};

  $scope.system.hypervisor = 'proxmox';

  $scope.loadForm = function () {
    $http({method: 'GET', url: '/types'}).
      success(function(data, status, headers, config) {
        $scope.types = [];
        angular.forEach(data.types,function(type){
           $scope.types.push(type);
        });
        $scope.system.type = $scope.types[0];
      }).error(function(data, status, headers, config) {
        console.log('failed to featc types');
      });
  };

  $scope.hypervisorSelect = function() {
    $scope.hypervisorTemplate = 'systems/add/'+$scope.system.hypervisor+'.tpl.html';
  };

  $scope.$watch( 'system.hypervisor', $scope.hypervisorSelect );

  $scope.submit = function(){
    Systems.save($scope.system,
      function(resp) {
        $location.path( '/system/'+resp.id);
	},function(errors){console.log(errors);}
     );
  };
  
  $scope.loadForm();
});
