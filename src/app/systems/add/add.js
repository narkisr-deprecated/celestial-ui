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
.controller('SystemAddCtrl', 
   function SystemAddController($scope, $http, $resource, $location, growl, loginService, usersService, loggingService) {

  var Systems = $resource('/systems/');
  var Environments = $resource('/environments/');
  
  $scope.machine = {};
  $scope.hypervisor = {};
  $scope.type = '';
  $scope.description = '';

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
	$scope.rawEnvs = data.environments;
      $scope.envs = [];
      angular.forEach(data.environments,function(v,k){
        $scope.envs.push(k);
      });
     $scope.env = $scope.envs[0];
    },function(error){
       console.log('failed to fetch environments');
    });
  };

  $scope.hypervisorSelect = function() {
   if($scope.currentHypervisor !== undefined){
     $scope.hypervisorTemplate = 'systems/add/'+$scope.currentHypervisor+'.tpl.html';
     switch ($scope.currentHypervisor) {
      case "proxmox": 
        $scope.hypervisor= {proxmox:{type:'ct'}};
        $scope.machine={};
        break;
      case "aws": 
        $scope.hypervisor = {aws:{endpoint:"ec2.us-east-1.amazonaws.com",'instance-type':'t1.micro'}};
        $scope.machine={};
        $scope.volumes=[];
        $scope.volume={clear:false};
        break;
      case "vcenter": 
        $scope.hypervisor= {vcenter:{'disk-format':'sparse'}};
        $scope.machine={};
        break;
      case "physical": 
        $scope.hypervisor= {physical:{}};
        $scope.machine={};
        break;
      case "docker": 
        $scope.hypervisor= {docker:{}};
        $scope.machine={};
        break;

     }
    }
  };

  $scope.$watch( 'currentHypervisor', $scope.hypervisorSelect);

  $scope.intoPersisted =function(system){
    switch ($scope.currentHypervisor) {
     case "proxmox":
	if(system.proxmox.features !== undefined){
        system.proxmox.features = system.proxmox.features.split(" ");
      }
      break;
     case "vcenter": 
      system.machine.names = system.machine.names.split(" ");
      break;
     case "aws": 
	system.aws.volumes = $scope.volumes;
      if(system.aws['security-groups'] !== undefined){
        system.aws['security-groups'] = system.aws['security-groups'].split(" ");
      }
      break;
    }
   return system;
  };


  $scope.setOses = function() {
    if($scope.env !== undefined){
      templates = $scope.rawEnvs[$scope.env][$scope.currentHypervisor].ostemplates;
      if(templates !== undefined){
         $scope.oses = _.keys(templates); 
        $scope.machine.os = $scope.oses[0];
      }
    }
  };

  $scope.$watch( 'currentHypervisor', $scope.setOses);

  $scope.setHypervisors = function() {
    if($scope.env !== undefined){
      $scope.hypervisors = _.keys($scope.rawEnvs[$scope.env]); 
      $scope.currentHypervisor = $scope.hypervisors[0];
    }
  };

  $scope.$watch( 'env', $scope.setHypervisors);

  $scope.addVolume = function() {
    var duplicate = _.find($scope.volumes,function(vol) {
      return vol.device == $scope.volume.device;
    });
    if(duplicate) {
	growl.addErrorMessage("cant add same device ("+ $scope.volume.device + ") twice.");
    } else {
      $scope.volumes.push($scope.volume);
      $scope.volume={clear:false};
    } 
  };

  $scope.removeVolume = function(device) {
    $scope.volumes = _.filter($scope.volumes,function(vol) {
      return vol.device != device;
    });
  };

  $scope.submit = function(){
    system = {type:$scope.type, env:$scope.env, machine:$scope.machine};
    system[$scope.currentHypervisor] = $scope.hypervisor[$scope.currentHypervisor];
    system.owner = $scope.owner;
    system.description= $scope.description;
    Systems.save($scope.intoPersisted(system),
      function(resp) {
        growl.addInfoMessage(resp.message);
        $location.path( '/system/'+resp.id);
	},loggingService.error);
  };
 
  $scope.isSuper = true;

  loginService.grabSession().then(function(data) {
    $scope.isSuper = loginService.isSuper(data);
    $scope.owner = data.username;
    if($scope.isSuper) {
     usersService.grabUsers().then(function(users) {
	$scope.users = _.map(users,function(user){return user.username;});
     });
    }
  });

  $scope.loadTypes();
  $scope.loadEnvs();
});
