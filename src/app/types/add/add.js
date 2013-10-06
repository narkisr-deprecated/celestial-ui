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
.controller( 'TypeAddCtrl', function typeAddController($scope, $http, $resource ,typesService) {

  $scope.typeId = '';
  $scope.currentProvisioner = 'puppet-std';
  $scope.type = {'puppet-std':{module:{}}};

  $scope.typeSelect = function() {
    $scope.provisionerTemplate = 'types/add/'+$scope.currentProvisioner+'.tpl.html';
  };

  $scope.$watch( 'currentProvisioner', $scope.typeSelect );

  $scope.submit = function(){
    typesService.save($scope.typeId,$scope.type); 
  };
  
});
