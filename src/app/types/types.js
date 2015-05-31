angular.module( 'celestial.types', [
  'ui.router', 'ui.bootstrap','celestial.typeAdd','celestial.typeEdit'
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
.factory('typesService', function($location, $http, $resource, growl, loggingService) {
  var typesService = {};

  var Types = $resource('/types/',{},{
    getType: {method : "GET", params:{type:'@type'},url:'/types/:type'},
    remove: {method : "DELETE", params:{type:'@type'},url:'/types/:type'},
    update: {method : "PUT",url:'/types/'}
  });

  typesService.get = function(typeId) {
    return Types.getType({type:typeId});
  };

  var intoPersisted = function(type) {
    var saved = angular.copy(type);
    if(typesService.provisionerOf(saved) == 'puppet-std'){
       _.each(_.keys(saved['puppet-std']),function(env){
        props = saved['puppet-std'][env];
        if(props !== undefined){
          if(props.args !== undefined && _.isString(props.args)){
            saved['puppet-std'][env].args = props.args.split(" ");
          }

          if(saved['puppet-std'][env].classes) {
            saved['puppet-std'][env].classes = JSON.parse(saved['puppet-std'][env].classes);
          }
        }
      });
    }
    return saved;
  };

  typesService.save = function(typeName,type) {
    newType = type;
    newType['type'] = typeName;
    newType = intoPersisted(newType);
    Types.save(newType, function(resp) {
        $location.path('/types');
         growl.addInfoMessage(resp.message);
	},loggingService.error);
  };

  typesService.update = function(typeId,type) {
    updatedType = type;
    updatedType = intoPersisted(updatedType);
    Types.update(updatedType, function(resp) {
        growl.addInfoMessage(resp.message);
        $location.path('/types');
      },loggingService.error);
  };

  typesService.provisionerOf = function(type) {
    return _.filter(['puppet-std','chef','puppet'], function(a){return type[a]!=null; })[0];
  };

  typesService.getAll = function() {
    return Types.get({}).$promise.then(function(data){
        return _.map(data.types,function(type){
           type.provisioner = typesService.provisionerOf(type);
           return type;
        });
    });
  };

  typesService.remove =  function(typeId){
    Types.remove({type:typeId},
      function(resp) {
        growl.addInfoMessage(resp.message);
        $location.path( '/types');
      },loggingService.error);
  };

  return typesService;
})

.controller( 'TypesCtrl', function TypesCtrl($scope, $resource, typesService) {
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
});
