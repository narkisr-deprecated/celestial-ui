angular.module( 'celestial.systemAdd', [
  'ui.state',  'ngResource'
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systemAdd', {
    url: '/system/add/',
    views: {
	"main": {
        controller: 'SystemAddCtrl',
        templateUrl: 'systems/add/add.tpl.html'
       }
    },
    data:{ pageTitle: 'New System' }
  });
})
.controller( 'SystemAddCtrl', function SystemAddController($scope, $http, $resource, $location,growl) {

  var Systems = $resource('/systems/');
  var Environments = $resource('/environments/');
  
  $scope.machine = {};
  $scope.hypervisor = {};
  $scope.type = '';
  $scope.env = '';
  $scope.currentHypervisor = 'proxmox';

  $scope.loadTypes = function () {
    $http({method: 'GET', url: '/types'}).
      success(function(data, status, headers, config) {
        $scope.types = [];
        angular.forEach(data.types,function(type){
           $scope.types.push(type.type);
        });
        $scope.type = $scope.types[0];
      }).error(function(data, status, headers, config) {
        console.log('failed to fetch types');
      });
     };

  $scope.loadEnvs = function() {
    Environments.get({},function(data){
      $scope.envs = [];
      angular.forEach(data.environments,function(v,k){
        $scope.envs.push(k);
        console.log(k);
      });
     $scope.env = $scope.envs[0];
    },function(error){
       console.log('failed to fetch environments');
    });
  };

  $scope.hypervisorSelect = function() {
    $scope.hypervisorTemplate = 'systems/add/'+$scope.currentHypervisor+'.tpl.html';
    switch ($scope.currentHypervisor) {
     case "proxmox": 
       $scope.hypervisor= {proxmox:{type:'ct'}};
       $scope.machine={};
       break;
     case "aws": 
       $scope.hypervisor = {aws:{endpoint:"ec2.us-east-1.amazonaws.com",'instance-type':'t1.micro'}};
       $scope.machine={};
       break;
     case "vcenter": 
       $scope.hypervisor= {vcenter:{'disk-format':'sparse'}};
       $scope.machine={};
       break;
    }
  };

  $scope.$watch( 'currentHypervisor', $scope.hypervisorSelect );

  $scope.intoPersisted =function(system){
    switch ($scope.currentHypervisor) {
     case "vcenter": 
      system.machine.names = system.machine.names.split(" ");
      break;
    }
   return system;
  };

  $scope.submit = function(){
    system = {type:$scope.type, env:$scope.env, machine:$scope.machine};
    system[$scope.currentHypervisor] = $scope.hypervisor[$scope.currentHypervisor];
    Systems.save($scope.intoPersisted(system),
      function(resp) {
        growl.addInfoMessage(resp.msg);
        $location.path( '/system/'+resp.id);
	},function(resp){
        growl.addInfoMessage(resp.errors);
        console.log(resp.errors);
      }
     );
  };
  
  $scope.loadTypes();
  $scope.loadEnvs();
});
