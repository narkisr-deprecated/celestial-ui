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

.controller( 'TypesCtrl', function TypesCtrl( $scope, $resource) {
  var Types = $resource('/types/');

  var provisioner = 
  $scope.perPage = 10;

  $scope.currentPage = 1;

  $scope.data = null;

  
  $scope.load = function(){
     Types.get({},function(data,resp){
         $scope.count = data.types.length;
         $scope.data = {};
         $scope.data.types = _.map(data.types,function(type){
            type.provisioner = _.filter(['puppet-std','chef','puppet'], function(a){return type[a]!=null; })[0];
            return type; 
         });
     });
  };


  $scope.setPage = function () {
    var from = ($scope.currentPage -  1) * $scope.perPage;
    var to = $scope.currentPage  * $scope.perPage;
    if($scope.data != null){
        $scope.types = $scope.data.types.slice(from,to);
    }
  };
  
  $scope.load();
  $scope.$watch( 'currentPage', $scope.setPage );
  $scope.$watch( 'data', $scope.setPage );


})

;
