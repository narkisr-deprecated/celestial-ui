angular.module( 'celestial.systems', [
  'ui.state', 'ui.bootstrap', 'ngResource',
  'celestial.system', 'celestial.systemAdd', 'celestial.actions', 'celestial.confirm',
  'angular-growl', 'ngAnimate' 
])
.config(function config($stateProvider) {
  $stateProvider.state( 'systems', {
    url: '/systems/:page',
    views: {
      "main": {
        controller: 'SystemsCtrl',
        templateUrl: 'systems/systems.tpl.html'
      }
    },
    data:{ pageTitle: 'Systems' }
  });
})
.factory('systemsService', function($resource, $http, growl, $location, $modal, $cookieStore, loggingService) {
  var systemsService = {};

  var Jobs = $resource('/jobs/', {},{
    create:{method : "POST", params:{id:'@id'},url:'/jobs/create/:id'},
    clone:{method : "POST", params:{id:'@id'},url:'/jobs/clone/:id'},
    provision:{method : "POST", params:{id:'@id'},url:'/jobs/provision/:id'},
    stage:{method : "POST", params:{id:'@id'},url:'/jobs/stage/:id'},
    start:{method : "POST", params:{id:'@id'},url:'/jobs/start/:id'},
    stop:{method : "POST", params:{id:'@id'},url:'/jobs/stop/:id'},
    destroy:{method : "POST", params:{id:'@id'},url:'/jobs/destroy/:id'},
    clear:{method : "POST", params:{id:'@id'},url:'/jobs/clear/:id'},
    reload:{method : "POST", params:{id:'@id'},url:'/jobs/reload/:id'}
   });

  systemsService.safeLaunch = function(target, job, launchFn) {

    var modalInstance = $modal.open({
      templateUrl: 'systems/confirm/confirm.tpl.html',
      controller: 'ConfirmCtrl',
	resolve: {job: function(){return job;}, target: function(){return target;}}
    });
   
    modalInstance.result.then(function () {
       launchFn();
    }, function () {
       growl.addErrorMessage('Not launching ' +job);
    });

  };

  systemsService.runJob = function(job, id) {
     Jobs[job]({id:id}, loggingService.info, loggingService.error);
  };

  systemsService.launchJob = function(id, target, job) {

    if($cookieStore.get('skipSystemConfirm')){
      systemsService.runJob(job, id);  
    } else {
	systemsService.safeLaunch(target,job,function(){systemsService.runJob(job, id);}); 
    }
  };

  systemsService.hypervisor = function(system) {
    hs = ['aws','proxmox','vcenter','physical','docker'];
    return _.filter(hs, function(a){return system[a]!=null; })[0];
  };

  return systemsService;
}).
directive('operations', function () {
    return {
      restrict: 'E',
      template: '<div class="btn-group">'+
       '<a class="btn" href="" disabled><i class="fa fa-list-ul"></i></a>'+
       '<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">'+
          '<span class="fa fa-caret-down"></span></a>'+
        '<ul class="dropdown-menu">'+
          '<li><a href="" ng-click="launchJob(system.id,"create")" tooltip-placement="right" tooltip="Create a running machine"><i class="fa-fixed-width fa fa-plus" ></i> Create</a></li>'+
          '<li><a href="" ng-click="launchJob(system.id,"provision")" tooltip-placement="right" tooltip="Run provisioining"><i class="fa-fixed-width fa fa-gears" ></i> Provision</a></li>'+
          '<li><a href="" ng-click="launchJob(system.id,"stage")" tooltip-placement="right" tooltip="Create and Provision"><i class="fa-fixed-width fa fa-refresh" ></i> Stage</a></li>'+
          '<li><a href="" ng-click="launchJob(system.id,"start")" tooltip-placement="right" tooltip="Start the backing machine"><i class="fa-fixed-width fa fa-play" ></i> Start</a></li>'+
          '<li><a href="" ng-click="launchJob(system.id,"stop")" tooltip-placement="right" tooltip="Stop the backing machine"><i class="fa-fixed-width fa fa-stop" ></i> Stop</a></li>'+
          '<li class="divider"></li>'+
          '<li><a href="" ng-click="launchJob(system.id,"destroy")" tooltip-placement="right" tooltip="Destroy machine"><i class="fa-fixed-width fa fa-trash-o" ></i> Destroy</a></li>'+
          '<li><a href="" ng-click="launchJob(system.id,"reload")" tooltip-placement="right" tooltip="Destroy and re-create machine"><i class="fa-fixed-width fa fa-warning" ></i> Reload</a></li>'+
          '<li><a href="" ng-click="launchJob(system.id,"clear")" tooltip-placement="right" tooltip="Clear system model"><i class="fa-fixed-width fa fa-eraser" ></i> Clear</a></li>'+
           '</ul>'+ '</div>',
      scope: {
        system: '='
      }
  };
})
.controller( 'SystemsCtrl', 
  function SystemsController($scope, $resource, actionsService, runService, $location, systemsService) {

  var Systems = $resource('/systems/', {page:'@page',offset:'@offset'});
  
  $scope.perPage = 10;
  $scope.currentPage = 1;
  $scope.currentPage= $location.path().replace('/systems/','');

  $scope.loadCount = function(){
     Systems.get({page:1,offset:$scope.perPage},function(data,resp){
        if(data.meta!=null){
          $scope.count = data.meta.total;
        }
     });
  };

  $scope.setPage = function () {
    var page = {page:$scope.currentPage,offset: $scope.perPage};
    $location.path('/systems/'+$scope.currentPage);
    Systems.get(page,function (data){
	$scope.systems = [];
      angular.forEach(data.systems,function(system){
        system[1]['id'] = system[0];
        system[1]['hypervisor'] = _.filter(['aws','proxmox','vcenter','physical','docker'],function(a){
           return system[1][a]!=null;
        })[0];
        system[1]['actions'] = actionsService.grabActions(system[1].type);
        $scope.systems.push(system[1]);
	});
    });
  };

  $scope.launchJob = function(id,job) { 
    var target = _.find($scope.systems,function(s){return s.id==id;});
    systemsService.launchJob(id, target, job);
  };

  $scope.launchAction = function(id, action) {
    if(action.provided === null || action.provided  === undefined) {
      actionsService.launchAction(id,action);
    } else {
      runService.run([id], action);            
    }
  };

  $scope.loadCount();
  $scope.$watch( 'currentPage', $scope.setPage );
   
});

