angular.module( 'celestial.system', [
  'ui.router', 'ui.bootstrap', 'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'system', {
    url: '/system/:id',
    views: {
	"main": {
        controller: 'SystemCtrl',
        templateUrl: 'systems/system/system.tpl.html'
	}
    },
    data:{ pageTitle: 'System'}
  });
})
.filter('capitalize', function() {
    return function(input, scope) {
        if(input!=null){
          return input.substring(0,1).toUpperCase()+input.substring(1);
        } else {
          return input;
        }
    };
}).filter('replaceCommas', function(){
  return function(text) {
     return text ? text.replace(/,/g, '=') : '';
  };
})
.controller( 'SystemCtrl', function SystemController($scope, $resource, $location, growl, systemsService, usersService) {

  var System = $resource('/systems/:id', {id:'@id'},{remove:{method:"DELETE"}});

  $scope.id = $location.path().replace("/system/", "");
  $scope.Operations = systemsService.Operations;
  usersService.loadOperations($scope);
  
  $scope.loadSystem = function(){
    $scope.system = System.get({id:$scope.id},function(sys,resp){
	$scope.hypervisor = systemsService.hypervisor(sys);
      $scope.hypervisorData = sys[$scope.hypervisor];
      $scope.headerTemplate = 'systems/system/'+$scope.hypervisor+'.tpl.html';
      $scope.system.id = $scope.id;
    });
  };

  $scope.remove= function(){
   System.remove({id:$scope.id},function(data){
     growl.addInfoMessage(data.message);
     $location.path("/systems"); 
   });
  };

  $scope.launchJob = function(id,job) { 
    systemsService.launchJob(id, $scope.system, job);
  };


  $scope.loadSystem();
});

