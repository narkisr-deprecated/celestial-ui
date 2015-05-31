angular.module( 'celestial.typeAdd', [
  'ui.router',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'typeAdd', {
    url: '/type/add/',
    views: {
	"main": {
        controller: 'TypeAddCtrl',
        templateUrl: 'types/add/add.tpl.html'
       }
    },
    data:{ pageTitle: 'New type' }
  });
})
.controller('TypeAddCtrl', function typeAddController($scope, $http, $resource,
             typesService ,envsService) {

  $scope.typeId = '';
  $scope.currentProvisioner = 'puppet-std';
  $scope.type = {};

  envsService.loadEnvs().then(function(data){
     $scope.envs = _.keys(data.environments);
     $scope.env = _.keys(data.environments)[0];
     $scope.type = {'puppet-std':{}};
  });

  $scope.typeSelect = function() {
    $scope.provisionerTemplate = 'types/add/'+$scope.currentProvisioner+'.tpl.html';
  };

  $scope.envSelect = function() {
    $scope.type['puppet-std'] = {};
    $scope.type['puppet-std'][$scope.env] = {module:{}};
  };

  $scope.$watch( 'currentProvisioner', $scope.typeSelect );
  $scope.$watch( 'env', $scope.envSelect );

  $scope.submit = function(){
    typesService.save($scope.typeId,$scope.type); 
  };
  
});
