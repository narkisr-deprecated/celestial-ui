
angular.module( 'celestial.systems', [
  'ui.state', 'ui.bootstrap', 'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systems', {
    url: '/systems',
    views: {
      "main": {
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.tpl.html'
      }
    },
    data:{ pageTitle: 'Systems' }
  });
})
.factory( 'systems', function($resource) {
  return {
    var Systems = $resource('/systems/', {page:'@page',limit:'@limit'});
    get: function(page, limit) {
      return Systems.get({page:page,limit:limit});
    },
    count: function() {
      return data.length;
    }
  };
});
.controller( 'SystemsCtrl', function SystemsController($scope,systems) {
  $scope.totalItems = 64;
  $scope.maxSize = 5;
  
  $scope.maxSize = 5;
  $scope.totalItems= Math.ceil(systems.count() / $scope.numPerPage);
  $scope.currentPage = 1;

  $scope.setPage = function () {
    $scope.data = myData.get( ($scope.currentPage - 1) * $scope.numPerPage, $scope.numPerPage );
  };
  
  $scope.$watch( 'currentPage', $scope.setPage );
});

