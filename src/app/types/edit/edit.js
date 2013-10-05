angular.module( 'celestial.typeEdit', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'typeEdit', {
    url: '/type/edit/:type',
    views: {
	"main": {
        controller: 'TypeEditCtrl',
        templateUrl: 'types/edit/edit.tpl.html'
       }
    },
    data:{ pageTitle: 'Edit type' }
  });
})
.controller( 'TypeEditCtrl', function typeEditController($scope, $location, typesService) {

  $scope.typeId = $location.path().replace("/type/edit/","");

  $scope.loadType = function(){
    typesService.get($scope.typeId).$promise.then(function(type) {
      $scope.type = type;
      $scope.type.classes = JSON.stringify(type.classes);
	$scope.type['puppet-std'].args = type['puppet-std'].args.join(" ");
      $scope.currentProvisioner = typesService.provisionerOf($scope.type);
      $scope.provisionerTemplate = 'types/edit/'+$scope.currentProvisioner+'.tpl.html';
    });
  };

  $scope.loadType();

  $scope.submit = function(){
    typesService.update($scope.typeId,$scope.type);
  };
  
});
