
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
.controller( 'SystemsCtrl', function SystemsController($scope,$resource) {

  var Systems = $resource('/systems/', {page:'@page',offset:'@offset'});

  $scope.perPage = 10;

  $scope.currentPage = 1;

  $scope.loadCount = function(){
     Systems.get({page:1,offset:$scope.perPage},function(data,resp){
         $scope.count = data.meta.total;
     });
  };

  $scope.loadCount();

  $scope.setPage = function () {
    var page = {page:$scope.currentPage,offset: $scope.perPage};
    Systems.get(page,function (data){
	$scope.systems = [];
      angular.forEach(data.systems,function(system){
        system[1]['id'] = system[0];
        system[1]['hypervisor'] = _.filter(['aws','proxmox','vsphere'],function(a){
           return system[1][a]!=null;
        })[0];
        $scope.systems.push(system[1]);
	});
    });
  };
  
  $scope.$watch( 'currentPage', $scope.setPage );

});

