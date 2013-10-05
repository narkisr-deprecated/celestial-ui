angular.module( 'celestial.type', [
  'ui.state', 'ui.bootstrap', 'ngResource','celestial.typeAdd'
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

.controller( 'TypeCtrl', function TypeController($scope,$resource,$location) {

  var Type = $resource('/types/:type', {type:'@type'});

  $scope.typeId = $location.path().replace("/type/", "");

  $scope.loadType = function(){
    $scope.type= Type.get({type:$scope.typeId},function(type,resp){
      $scope.provisioner = _.filter(['puppet-std','chef','puppet'], function(a){return type[a]!=null; })[0];
	$scope.type = type;
	$scope.headerTemplate = 'types/type/'+$scope.provisioner+'.tpl.html';
    });
  };

   $scope.loadType();
});

