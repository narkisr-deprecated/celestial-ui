angular.module( 'celestial.types', [
  'ui.state', 'ui.bootstrap','celestial.type'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'types', {
    url: '/types',
    views: {
      "main": {
        controller: 'TypesCtrl',
        templateUrl: 'types/types.tpl.html'
      }
    },
    data:{ pageTitle: 'Types' }
  });
})
.factory('typesService', function($location, $http, $resource) {
  var typesService = {};

  var Types = $resource('/types/',{},{

  });

  typesService.save = function(typeName,newType) {
    console.log(newType);
    newType['type'] = typeName;
    newType['puppet-std']['args'] =_.words(newType['puppet-std']['args']);
    newType['classes'] = JSON.parse(newType.classes);
    Types.save(newType, function(resp) {
        $location.path('/type/'+typeName);
	},function(errors){
        console.log(errors);
	});
  };

  typesService.update= function(type) {
  };
  
  typesService.getAll = function() {
    return Types.get({}).$promise.then(function(data){
        return  _.map(data.types,function(type){
           type.provisioner = _.filter(['puppet-std','chef','puppet'], function(a){return type[a]!=null; })[0];
           return type; 
        });
    });
  };

  return typesService;
})

.controller( 'TypesCtrl', function TypesCtrl( $scope, $resource,typesService) {
  $scope.perPage = 10;
  $scope.data = {};

  $scope.load = function(){
    typesService.getAll().then(function(types){
     $scope.data.types= types;
     $scope.currentPage = 1;
     $scope.count = $scope.data.types.length;
    });
  };

  $scope.load();

  $scope.setPage = function () {
    var from = ($scope.currentPage -  1) * $scope.perPage;
    var to = $scope.currentPage  * $scope.perPage;
    if($scope.data.types != null){
        $scope.types = $scope.data.types.slice(from,to);
    }
  };
  
  $scope.$watch( 'currentPage', $scope.setPage );
  $scope.$watch( 'data.types', $scope.setPage );


})

;
