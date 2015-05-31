angular.module( 'celestial.typeEdit', [
  'ui.router',  'ngResource'
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
.controller( 'TypeEditCtrl', function typeEditController($scope, $location, typesService, envsService) {

  $scope.typeId = $location.path().replace("/type/edit/","");

  envsService.loadEnvs().then(function(data){
     $scope.envs = _.keys(data.environments);
  });

  $scope.envSelect = function() {
    if($scope.provisioner !== undefined && $scope.type !== undefined){
       if(_.isEmpty($scope.type[$scope.provisioner][$scope.env])){
         $scope.type[$scope.provisioner][$scope.env] = {module:{}};
       }
       prov = $scope.type[$scope.provisioner][$scope.env];
       if($scope.provisioner == 'puppet-std' && prov !== undefined ) {
        if(_.isObject(prov.classes)){
          prov.classes = JSON.stringify(prov.classes);
        }
        if(prov.args !== undefined && _.isArray(prov.args)){
          prov.args = prov.args.join(" ");
        }
      }
      $scope.type[$scope.provisioner][$scope.env] = prov;
    }
  };

  $scope.loadType = function(){
    typesService.get($scope.typeId).$promise.then(function(type) {
      $scope.type = type;
      $scope.provisioner = typesService.provisionerOf($scope.type);
	$scope.env = _.keys($scope.type[$scope.provisioner])[0];
      $scope.provisionerTemplate = 'types/edit/'+$scope.provisioner+'.tpl.html';
    });
  };

  $scope.loadType();
  $scope.$watch( 'env', $scope.envSelect );

  $scope.submit = function(){
    typesService.update($scope.typeId,$scope.type);
  };

  $scope.remove = function() {
    typesService.remove($scope.typeId);
  };

});
