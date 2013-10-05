angular.module( 'celestial.type', [
  'ui.state', 'ui.bootstrap', 'ngResource','celestial.typeAdd','celestial.typeEdit'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'type', {
    url: '/type/:type',
    views: {
	"main": {
        controller: 'TypeCtrl',
        templateUrl: 'types/type/type.tpl.html'
	}
    },
    data:{ pageTitle: 'Type'}
  });
})

.controller( 'TypeCtrl', function TypeController($scope,$location,typesService) {

  $scope.typeId = $location.path().replace("/type/", "");

  $scope.loadType = function(){
    typesService.get($scope.typeId).$promise.then(function(type) {
	$scope.type = type;
      $scope.provisioner = typesService.provisionerOf($scope.type);
      $scope.headerTemplate = 'types/type/'+$scope.provisioner+'.tpl.html';
    });
  };

   $scope.loadType();
});

