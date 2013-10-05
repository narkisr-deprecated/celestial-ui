angular.module( 'celestial.systems', [
  'ui.state', 'ui.bootstrap', 'ngResource',
  'celestial.system', 'celestial.systemAdd', 'celestial.actions',
  'angular-growl', 'ngAnimate'
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
.controller( 'SystemsCtrl', function SystemsController($scope, $resource, $http, actionsService, growl) {

  var Systems = $resource('/systems/', {page:'@page',offset:'@offset'});
  var Jobs = $resource('/jobs/', {},{
   create:{method : "POST", params:{id:'@id'},url:'/jobs/create/:id'},
   provision:{method : "POST", params:{id:'@id'},url:'/jobs/provision/:id'},
   stage:{method : "POST", params:{id:'@id'},url:'/jobs/stage/:id'},
   destroy:{method : "POST", params:{id:'@id'},url:'/jobs/destroy/:id'}
  });


  $scope.perPage = 10;
  $scope.currentPage = 1;

  $scope.loadCount = function(){
     Systems.get({page:1,offset:$scope.perPage},function(data,resp){
        if(data.meta!=null){
          $scope.count = data.meta.total;
        }
     });
  };

  $scope.setPage = function () {
    var page = {page:$scope.currentPage,offset: $scope.perPage};
    Systems.get(page,function (data){
	$scope.systems = [];
      angular.forEach(data.systems,function(system){
        system[1]['id'] = system[0];
        system[1]['hypervisor'] = _.filter(['aws','proxmox','vsphere'],function(a){
           return system[1][a]!=null;
        })[0];
        system[1]['actions'] = actionsService.loadActions(system[1].type);
        
        $scope.systems.push(system[1]);
	});
    });
  };
  
  $scope.launchJob = function(id,job) {
    Jobs[job]({id:id},function(data) {
       growl.addInfoMessage(data.msg);
    });
  };

  $scope.launchAction = function(id,action) {
    actionsService.launchAction(id,action);
  };

  $scope.loadCount();
  $scope.$watch( 'currentPage', $scope.setPage );
   
});

