angular.module( 'celestial.system', [
  'ui.state', 'ui.bootstrap', 'ngResource'
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
})
.controller( 'SystemCtrl', function SystemController($scope,$resource,$location,growl) {

  var System = $resource('/systems/:id', {id:'@id'},{remove:{method:"DELETE"}});

  $scope.id = $location.path().replace("/system/", "");

  $scope.loadSystem = function(){
    $scope.system = System.get({id:$scope.id},function(sys,resp){
      $scope.hypervisor = _.filter(['aws','proxmox','vcenter','physical','docker'], function(a){return sys[a]!=null; })[0];
      $scope.hypervisorData = sys[$scope.hypervisor];
      $scope.headerTemplate = 'systems/system/'+$scope.hypervisor+'.tpl.html';
    });
  };

  $scope.remove= function(){
   System.remove({id:$scope.id},function(data){
     growl.addInfoMessage(data.message);
     $location.path("/systems"); 
   });
  };

  $scope.loadSystem();
});

