angular.module( 'celestial.typeAdd', [
  'ui.state',  'ngResource'
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
     $scope.type = {'puppet-std':{module:{options:{}}}};
  });

  $scope.typeSelect = function() {
    $scope.provisionerTemplate = 'types/add/'+$scope.currentProvisioner+'.tpl.html';
  };

  $scope.envSelect = function() {
    $scope.type['puppet-std'] = {};
    $scope.type['puppet-std'][$scope.env] = {module:{options:{}}};
  };

  $scope.isHttps = function(){
    return $scope.type[$scope.currentProvisioner][$scope.env].module.src.startsWith('https');
  };


  $scope.$watch( 'currentProvisioner', $scope.typeSelect );
  $scope.$watch( 'env', $scope.envSelect );

  $scope.submit = function(){
    if(!$scope.isHttps() && $scope.type[$scope.currentProvisioner][$scope.env].module.options.unsecure){
	delete $scope.type[$scope.currentProvisioner][$scope.env].module.options['unsecure'];
    }
    typesService.save($scope.typeId,$scope.type); 
  };
  
});
